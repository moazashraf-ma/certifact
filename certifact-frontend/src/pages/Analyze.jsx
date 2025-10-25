// frontend/src/pages/Analyze.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import FileDropzone from '../components/FileDropzone';
import ProgressIndicator from '../components/ProgressIndicator';
import { useAppContext } from '../context/AppContext';
import useToast from '../hooks/useToast';
import api from '../api/client';
import { FaFileUpload, FaTasks, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const STEPS = [
  { label: 'Upload File', icon: <FaFileUpload /> },
  { label: 'Queued', icon: <FaTasks /> },
  { label: 'Processing', icon: <FaTasks /> },
  { label: 'Done', icon: <FaCheckCircle /> },
];

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [jobId, setJobId] = useState(null);
  const [statusMessage, setStatusMessage] = useState('Waiting for file upload...');
  const [isUploading, setIsUploading] = useState(false);
  const [analysisError, setAnalysisError] = useState(false);
  const navigate = useNavigate();
  const { setCurrentJob } = useAppContext();
  const { showSuccessToast, showErrorToast } = useToast();
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    return () => { // Cleanup on unmount
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleFileSelected = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setStatusMessage(`File selected: ${selectedFile.name}`);
      handleUpload(selectedFile);
    }
  };

  const handleUpload = async (fileToUpload) => {
    setIsUploading(true);
    setStatusMessage('Uploading file...');
    setAnalysisError(false);
    setCurrentStep(0);

    try {
      const response = await api.upload(fileToUpload);
      setJobId(response.jobId);
      setCurrentJob({ jobId: response.jobId, file: fileToUpload, createdAt: new Date().toISOString() });
      setStatusMessage('File uploaded. Job is queued...');
      setCurrentStep(1);
      showSuccessToast('Upload Successful!');
      startPollingStatus(response.jobId);
    } catch (error) {
      setStatusMessage(error.message || 'Upload failed. Please try again.');
      showErrorToast('Upload Failed', error.message);
      setAnalysisError(true);
      setIsUploading(false);
    }
  };

  const startPollingStatus = (currentJobId) => {
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);

    pollIntervalRef.current = setInterval(async () => {
      try {
        const statusResponse = await api.getStatus(currentJobId);
        // DEBUGGING: Log the exact response from the backend
        console.log("Polling Status Response:", statusResponse);

        const { status, resultId } = statusResponse;

        if (status === 'queued') {
          setStatusMessage('Job queued...');
          setCurrentStep(1);
        } else if (status === 'processing') {
          setStatusMessage('Processing analysis...');
          setCurrentStep(2);
        } else if (status === 'done') {
          clearInterval(pollIntervalRef.current);
          setStatusMessage('Analysis complete!');
          setCurrentStep(3);
          showSuccessToast('Analysis Complete!');
          
          // CRITICAL FIX: Navigate only if resultId is valid
          if (resultId) {
            navigate(`/results/${resultId}`);
          } else {
            throw new Error('Analysis done, but no Result ID was returned.');
          }
        } else if (status === 'error') {
          throw new Error('Analysis failed on the server.');
        }
      } catch (error) {
        clearInterval(pollIntervalRef.current);
        setStatusMessage(error.message);
        showErrorToast('Error', error.message);
        setAnalysisError(true);
      }
    }, 3000);
  };

  return (
    <div className="container py-5">
      <h1 className="text-center mb-5 display-4 fw-bold text-primary">Analyze Media for Deepfakes</h1>
      <div className="card shadow-lg p-4 p-md-5 mb-5 border-0 rounded-4">
        <div className="card-body">
          <ProgressIndicator steps={STEPS} currentStep={currentStep} />
          <div className="text-center my-4">
            {analysisError ? (
              <div className="alert alert-danger"><FaExclamationCircle className="me-2" />{statusMessage}</div>
            ) : (
              <p className="lead text-muted">{statusMessage}</p>
            )}
          </div>
          <div className="mb-4">
            <FileDropzone
              onFileSelected={handleFileSelected}
              acceptedFileTypes={{ 'image/*': ['.jpeg', '.png', '.gif'], 'video/*': ['.mp4'] }}
              disabled={isUploading || (jobId && !analysisError)}
            />
            {file && <p className="text-center mt-2 text-muted">Selected file: <span className="fw-bold">{file.name}</span></p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyze;