from flask import Flask, request, jsonify, send_from_directory,Response
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from pymongo import MongoClient
from bson import ObjectId
from bson.errors import InvalidId
import datetime
import os
import uuid
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image as keras_image
import cv2
import threading
import time
import albumentations as A
from mtcnn import MTCNN
from fpdf import FPDF 
from report_generator import generate_analysis_report 

# ================== SETUP ==================
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# --- SECURITY CONFIGURATION ---
app.config["JWT_SECRET_KEY"] = "80d0d67d6c98cdab56631b7a352a3ce9073a2e68e5150c9db52791e750fd265c"
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# ================== MONGODB CONNECTION ==================
MONGO_URI = "mongodb+srv://mohsin1:mohsin12@certi-fact-db.xnw07ls.mongodb.net/certifact?retryWrites=true&w=majority"
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client["certifact"]
jobs_collection = db["jobs"]
results_collection = db["results"]
users_collection = db["users"]

# ================== LOAD MODELS ==================
IMAGE_MODEL_PATH = 'model/best_finetuned_xception.h5'
VIDEO_MODEL_PATH = 'model/deepfake_detector_v6_final_stable.h5'
mtcnn_detector = None 

try:
    image_model = load_model(IMAGE_MODEL_PATH)
    print("✅ Image model loaded successfully!")
except Exception as e:
    print(f"🔥 Error loading image model: {e}")
    image_model = None

try:
    video_model = load_model(VIDEO_MODEL_PATH)
    print("✅ Video model loaded successfully!")
except Exception as e:
    print(f"🔥 Error loading video model: {e}")
    video_model = None

try: 
    mtcnn_detector = MTCNN()
    print("✅ MTCNN face detector loaded successfully!")
except Exception as e:
    print(f"🔥 Error loading MTCNN model: {e}")


# ================== AUGMENTATION LOGIC ==================
augmentation_pipeline = A.Compose([
    A.HorizontalFlip(p=0.5),
    A.OneOf([
        A.ColorJitter(p=0.8),
        A.RandomBrightnessContrast(p=0.8)
    ], p=1.0),
    A.GaussNoise(p=0.3),
    A.ImageCompression(quality_lower=70, p=0.5)
])

# ================== VIDEO PROCESSING HELPERS ==================

def crop_video_to_face(in_path, out_path, detector):
    cap = None
    w = None
    try:
        cap = cv2.VideoCapture(in_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        original_size = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        w = cv2.VideoWriter(out_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, original_size)
        
        frame_count = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            frame_count += 1
            processed_frame = frame # Default to original frame
            
            # Detect faces
            faces = detector.detect_faces(frame)
            
            if faces:
                # Get the bounding box of the first (and likely only) face
                x, y, width, height = faces[0]['box']
                # Add padding and ensure coordinates are within frame bounds
                x1, y1 = max(0, x - 20), max(0, y - 20)
                x2, y2 = min(frame.shape[1], x + width + 20), min(frame.shape[0], y + height + 20)
                
                # Crop the face
                cropped_face = frame[y1:y2, x1:x2]
                
                # Resize cropped face back to the original video dimensions for consistency
                processed_frame = cv2.resize(cropped_face, original_size)

            w.write(processed_frame)

        print(f"✅ Face cropping successful for {in_path}. Processed {frame_count} frames.")
        return True
    except Exception as e:
        print(f"🔥 Error during face cropping for {in_path}: {e}")
        return False
    finally:
        if cap and cap.isOpened():
            cap.release()
        if w and w.isOpened():
            w.release()

def augment_video(in_path, out_path, transform):
    cap = None
    w = None
    try:
        cap = cv2.VideoCapture(in_path)
        fps = cap.get(cv2.CAP_PROP_FPS) or 30
        ts = (int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))
        w = cv2.VideoWriter(out_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, ts)
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            augmented_frame = transform(image=frame)['image']
            w.write(augmented_frame)
        print(f"✅ Video augmentation successful. Saved to {out_path}")
    except Exception as e:
        print(f"🔥 Error during video augmentation for {in_path}: {e}")
    finally:
        if cap and cap.isOpened():
            cap.release()
        if w and w.isOpened():
            w.release()

# ================== WORKER FUNCTION ==================
def process_media(job_id, file_path, media_type, user_id):
    print(f"🚀 Starting background processing for job: {job_id}")
    jobs_collection.update_one(
        {"_id": ObjectId(job_id)},
        {"$set": {"status": "processing", "updated_at": datetime.datetime.now(datetime.UTC)}}
    )
    
    face_cropped_path = None
    final_processed_path = None

    try:
        is_deepfake, confidence = (False, 0.0)
        thumbnail_filename = None

        if media_type == 'image' and image_model:
            thumbnail_filename = os.path.basename(file_path)
            img = keras_image.load_img(file_path, target_size=(150, 150))
            img_array = keras_image.img_to_array(img)
            img_array = np.expand_dims(img_array, axis=0) / 255.0
            pred = image_model.predict(img_array)[0][0]
            is_deepfake = bool(pred > 0.5)
            confidence = float(pred if is_deepfake else 1 - pred)

        elif media_type == 'video' and video_model and mtcnn_detector:
            try:
                cap = cv2.VideoCapture(file_path)
                success, frame = cap.read()
                if success:
                    base_name = os.path.splitext(os.path.basename(file_path))[0]
                    thumbnail_filename = f"{base_name}.jpg"
                    cv2.imwrite(os.path.join(UPLOAD_FOLDER, thumbnail_filename), frame)
                cap.release()
            except Exception as thumb_e:
                print(f"🔥 WARNING: Could not create thumbnail: {thumb_e}")
            
            # --- DEFINE TEMP FILE PATHS ---
            base, ext = os.path.splitext(file_path)
            face_cropped_path = f"{base}_face_cropped{ext}"
            final_processed_path = f"{base}_aug{ext}"

            # --- STEP 1: CROP VIDEO TO FACE ---
            print(f"🛠️ [1/3] Cropping faces from video: {file_path}")
            crop_video_to_face(file_path, face_cropped_path, mtcnn_detector)

            # --- STEP 2: AUGMENT THE FACE-CROPPED VIDEO ---
            print(f"🛠️ [2/3] Augmenting face-cropped video: {face_cropped_path}")
            augment_video(face_cropped_path, final_processed_path, augmentation_pipeline)
            
            # --- STEP 3: ANALYZE THE FINAL PROCESSED VIDEO ---
            print(f"🔬 [3/3] Analyzing final video: {final_processed_path}")
            cap = cv2.VideoCapture(final_processed_path) # <-- MODIFIED: Use the final processed video
            frames = []
            frame_count = 0
            while True:
                ret, frame = cap.read()
                if not ret: break
                frame_count += 1
                if frame_count % 15 == 0:
                    # The frames are already the correct size from the cropping step,
                    # but resizing again ensures consistency for the model.
                    frame = cv2.resize(frame, (150, 150))
                    frames.append(frame)
            cap.release()
            
            if len(frames) > 0:
                frames = np.array(frames) / 255.0
                predictions = video_model.predict(frames)
                avg_prediction = np.mean(predictions)
                is_deepfake = bool(avg_prediction > 0.5)
                confidence = float(avg_prediction if is_deepfake else 1 - avg_prediction)
            else:
                raise ValueError("No frames extracted from the final processed video for analysis.")

        result_doc = {
            "job_id": ObjectId(job_id), "user_id": ObjectId(user_id), "type": media_type,
            "filename": os.path.basename(file_path), "file_url": f"/uploads/{os.path.basename(file_path)}",
            "thumbnail_url": f"/uploads/{thumbnail_filename}" if thumbnail_filename else None,
            "is_deepfake": is_deepfake, "confidence": confidence, "label": "AI-generated" if is_deepfake else "Real",
            "confidence_percent": round(confidence * 100, 2), "timestamp": datetime.datetime.now(datetime.UTC)
        }
        result = results_collection.insert_one(result_doc)
        result_id = str(result.inserted_id)

        jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"status": "done", "result_id": result_id, "updated_at": datetime.datetime.now(datetime.UTC)}}
        )
        print(f"✅ Job {job_id} completed. Result ID: {result_id}")

    except Exception as e:
        print(f"🔥 ERROR processing job {job_id}: {e}")
        jobs_collection.update_one(
            {"_id": ObjectId(job_id)},
            {"$set": {"status": "error", "error_message": str(e), "updated_at": datetime.datetime.now(datetime.UTC)}}
        )
    finally:
        print("🗑️ Starting cleanup of temporary files...")
        if face_cropped_path and os.path.exists(face_cropped_path):
            try:
                os.remove(face_cropped_path)
                print(f"   -> Deleted temp file: {face_cropped_path}")
            except Exception as clean_e:
                print(f"🔥 WARNING: Could not delete temp file {face_cropped_path}: {clean_e}")
        if final_processed_path and os.path.exists(final_processed_path):
            try:
                os.remove(final_processed_path)
                print(f"   -> Deleted temp file: {final_processed_path}")
            except Exception as clean_e:
                print(f"🔥 WARNING: Could not delete temp file {final_processed_path}: {clean_e}")

# ================== API ROUTES ==================
@app.route('/uploads/<filename>')
def serve_uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

# --- AUTHENTICATION ROUTES ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email address already in use"}), 409

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({
        "name": name,
        "email": email,
        "password_hash": hashed_password,
        "created_at": datetime.datetime.now(datetime.UTC)
    })
    
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = users_collection.find_one({"email": email})

    if user and bcrypt.check_password_hash(user['password_hash'], password):
        access_token = create_access_token(identity=str(user['_id']))
        return jsonify(access_token=access_token)

    return jsonify({"error": "Invalid email or password"}), 401

# --- PROTECTED ROUTES ---
@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    current_user_id = get_jwt_identity()
    if 'mediaFile' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['mediaFile']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    unique_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_FOLDER, unique_name)
    file.save(file_path)
    media_type = 'video' if 'video' in file.content_type else 'image'

    job_result = jobs_collection.insert_one({
        "user_id": ObjectId(current_user_id),
        "status": "queued",
        "created_at": datetime.datetime.now(datetime.UTC),
    })
    job_id = str(job_result.inserted_id)
    thread = threading.Thread(target=process_media, args=(job_id, file_path, media_type, current_user_id))
    thread.start()
    return jsonify({"jobId": job_id}), 202

@app.route('/api/status/<string:job_id>', methods=['GET'])
@jwt_required()
def get_status(job_id):
    current_user_id = get_jwt_identity()
    try:
        job = jobs_collection.find_one({"_id": ObjectId(job_id), "user_id": ObjectId(current_user_id)})
        if not job:
            return jsonify({"error": "Job not found"}), 404
        response = {
            "status": job.get('status', 'unknown'),
            "resultId": job.get('result_id', None)
        }
        return jsonify(response)
    except Exception:
        return jsonify({"error": "Invalid Job ID"}), 400

@app.route('/api/results/<string:result_id>', methods=['GET'])
@jwt_required()
def get_result(result_id):
    current_user_id = get_jwt_identity()
    try:
        obj_id = ObjectId(result_id)
        user_obj_id = ObjectId(current_user_id)

        result = results_collection.find_one({"_id": obj_id, "user_id": user_obj_id})

        if not result:
            return jsonify({"error": "Result not found or you do not have permission to view it"}), 404

        result['_id'] = str(result['_id'])
        result['job_id'] = str(result['job_id'])
        result['user_id'] = str(result['user_id'])

        return jsonify(result)

    except InvalidId:
        return jsonify({"error": f"The provided Result ID '{result_id}' is not a valid format."}), 400
    except Exception as e:
        print(f"An unexpected error occurred in get_result: {e}")
        return jsonify({"error": "An internal server error occurred"}), 500

@app.route('/api/history', methods=['GET'])
@jwt_required()
def get_history():
    current_user_id = get_jwt_identity()
    try:
        history = list(results_collection.find(
            {"user_id": ObjectId(current_user_id)}
        ).sort("timestamp", -1))

        for item in history:
            item["_id"] = str(item["_id"])
            if "job_id" in item:
                item["job_id"] = str(item["job_id"])
            if "user_id" in item:
                item["user_id"] = str(item["user_id"])

        return jsonify(history), 200
    except Exception as e:
        return jsonify({"error": f"Could not fetch history: {str(e)}"}), 500

# ================== DASHBOARD ROUTE ==================
@app.route('/api/dashboard-stats', methods=['GET'])
@jwt_required()
def get_dashboard_stats():
    current_user_id = get_jwt_identity()
    user_obj_id = ObjectId(current_user_id)

    try:
        user = users_collection.find_one({"_id": user_obj_id}, {"name": 1})
        user_name = user.get("name", "User") if user else "User"
        total_analyses = results_collection.count_documents({"user_id": user_obj_id})

        pipeline = [
            {"$match": {"user_id": user_obj_id}},
            {"$group": {"_id": "$label", "count": {"$sum": 1}}}
        ]
        label_counts = list(results_collection.aggregate(pipeline))
        deepfake_count = 0
        real_count = 0
        for item in label_counts:
            if item['_id'] == 'AI-generated':
                deepfake_count = item['count']
            elif item['_id'] == 'Real':
                real_count = item['count']

        recent_analyses = list(results_collection.find(
            {"user_id": user_obj_id}
        ).sort("timestamp", -1).limit(5))

        for item in recent_analyses:
            item["_id"] = str(item["_id"])
            item["job_id"] = str(item["job_id"])
            item["user_id"] = str(item["user_id"])

        stats = {
            "userName": user_name, "totalAnalyses": total_analyses,
            "deepfakeCount": deepfake_count, "realCount": real_count,
            "recentAnalyses": recent_analyses
        }
        return jsonify(stats), 200
    except Exception as e:
        print(f"An unexpected error occurred in get_dashboard_stats: {e}")
        return jsonify({"error": "Could not fetch dashboard statistics"}), 500
    
# ================== REPORT DOWNLOAD ROUTE ==================
@app.route('/api/results/<string:result_id>/report', methods=['GET'])
@jwt_required()
def download_report(result_id):
    current_user_id = get_jwt_identity()
    try:
        # 1. Fetch the analysis result from the database, ensuring user has permission
        result = results_collection.find_one({
            "_id": ObjectId(result_id), 
            "user_id": ObjectId(current_user_id)
        })

        if not result:
            return jsonify({"error": "Analysis result not found or permission denied"}), 404
        
        # 2. Call your report generator to create the PDF content in memory
        pdf_content = generate_analysis_report(result)
        
        # 3. Create a standardized filename as per your requirements
        filename = f"CF_Report_{result_id}.pdf"
        
        # 4. Send the PDF file back to the user
        return Response(
            pdf_content,
            mimetype="application/pdf",
            headers={"Content-Disposition": f"attachment;filename={filename}"}
        )

    except InvalidId:
        return jsonify({"error": "Invalid Result ID format."}), 400
    except Exception as e:
        print(f"🔥 ERROR generating PDF for result {result_id}: {e}")
        return jsonify({"error": "Could not generate report. Please try again later."}), 500


# ================== RUN SERVER ==================
if __name__ == '__main__':
    app.run(debug=True, port=5000)