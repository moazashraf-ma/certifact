# certifact-backend/report_generator.py

import random
from fpdf import FPDF
import os

# --- DEFINE YOUR POOLS OF REPORT TEXTS HERE ---
REPORT_TEXT_POOLS = {
    "AI-generated": {
    "50-60": [
        "The evidence detected suggests a moderate chance of manipulation, though it is not conclusive. Subtle irregularities such as inconsistent texture granularity and minor lighting mismatches were found across portions of the media. These deviations resemble the kind of soft anomalies produced by AI-based generative methods, though they could also be explained by video compression or lens noise. Because of this ambiguity, the probability score remains within a cautious 50-60% bracket.\n\nIn practical terms, this range indicates that while AI involvement is possible, the findings alone are insufficient to firmly establish the content as fabricated. A manual expert review or cross-check with external verification sources is strongly advised.",
        "Content in the 50-60% range falls into what we consider an 'uncertain zone.' The system has identified a set of anomalies—such as minor edge distortions, subtle inconsistencies in background sharpness, and unnatural blending at transition points—that raise concerns. However, these indicators are not dominant or frequent enough to strongly confirm artificial synthesis.\n\nThis suggests the media may be authentic but degraded by technical processes, or it may indeed carry light traces of digital alteration. Given the probability level, further investigation is required to strengthen the verdict.",
        "At this level of analysis, the results are indicative but not definitive. Certain frames reveal irregular texture smoothing and pixel-level patterns inconsistent with natural camera sensors. Yet, the evidence lacks the intensity seen in higher confidence brackets, meaning authenticity cannot be ruled out.\n\nThis category is best interpreted as a warning. While the system leans slightly toward detecting manipulation, it remains equally plausible that the observed artifacts are side effects of compression, resizing, or environmental conditions during capture.",
        "Media assigned a 50-60% probability often displays inconsistencies that sit on the borderline between authentic degradation and artificial generation. In this sample, there were signs of unusual noise distributions, slight inconsistencies in skin tone shading, and minor alignment issues in facial symmetry. None of these are strong enough to individually confirm deepfake presence, but collectively they form a pattern worth monitoring.\n\nUsers should not treat this verdict as confirmation of manipulation. Instead, it should serve as an early alert to proceed carefully and seek supplementary validation.",
        "In this category, the system has flagged a modest likelihood of manipulation. Evidence such as irregular eye reflections, faint blurring in dynamic regions, and texture smoothing inconsistent with sensor data were found. However, these anomalies appear sporadically and are not robustly sustained throughout the footage.\n\nBecause the detected markers are relatively weak, they cannot support a decisive conclusion. This level is best seen as a 'yellow flag,' meaning suspicion is justified but further evidence is needed before making any formal claim.",
        "The 50-60% probability bracket indicates that digital manipulation is plausible but far from certain. Our analysis revealed traces of non-random noise structures and subtle lighting transitions that deviate from physical realism. However, these patterns alone do not decisively prove artificial origin, as environmental factors like poor lighting or data compression may mimic similar effects.\n\nThis level therefore reflects a cautious suspicion rather than confirmation. It is advised that additional forensic checks or corroborative evidence be sought to reach a firmer determination."
    ],

    "60-70": [
        "The findings in this range point to a significant chance of AI manipulation. Multiple anomalies—such as inconsistent shadow directions, texture mismatches across facial regions, and background artifacts—were identified across the sample. While still short of absolute certainty, these indicators collectively lean strongly toward the likelihood of synthetic origin.\n\nContent falling in this bracket should be treated with caution, particularly in sensitive contexts like identity verification or legal proceedings.",
        "At the 60-70% confidence level, the analysis shows that the media contains structural and temporal inconsistencies difficult to explain naturally. For example, subtle delays in facial motion relative to audio, flickering background regions, and irregular blending around hair edges were detected. These are known weaknesses of generative deepfake models.\n\nWhile authentic footage can sometimes display compression artifacts, the number and consistency of these red flags suggest manipulation is highly probable.",
        "The probability score of 60-70% reflects a rising weight of evidence toward AI involvement. The system flagged unusual motion artifacts during frame transitions, along with lighting irregularities that change across consecutive scenes. Such behaviors align more closely with synthesized content than with genuine recordings.\n\nAlthough some uncertainty remains, this confidence range strongly tilts toward a manipulated outcome. The reliability of the media is compromised unless validated through secondary checks.",
        "Within this range, the system has picked up on anomalies such as overly smooth textures, unrealistic eye highlights, and unnatural blending between subject and background. These cues, while subtle individually, collectively suggest the hand of a generative process. Unlike in lower probability ranges, here the markers appear repeatedly enough to strengthen the case.\n\nThis classification should serve as a strong alert to potential manipulation, though definitive proof would require corroboration from additional forensic analysis.",
        "The 60-70% confidence level represents a tipping point where natural explanations become increasingly unlikely. Our system documented irregular geometry in facial contours, slight inconsistencies in the synchronization of expressions, and temporal instability across frames. Together, these create a strong case for digital alteration.\n\nThis probability bracket implies that trust in the media should be significantly reduced, especially where authenticity is critical.",
        "Content in this category reveals a marked presence of deepfake indicators. Detected issues included lighting inconsistencies across different parts of the subject’s face, small but repeated misalignments during head movement, and edge blending irregularities in areas like ears and hairlines.\n\nThese anomalies, though not definitive proof on their own, build a cumulative case leaning heavily toward synthetic generation. Users should approach this content with a presumption of manipulation until independently verified."
    ],

    "70-80": [
        "At the 70-80% range, the probability of AI manipulation is very strong. Distortions such as unnatural blinking patterns, uniform skin textures lacking organic imperfections, and unstable reflections in the eyes were consistently observed. These issues are hallmarks of deepfake production and appear too frequently to dismiss as incidental artifacts.\n\nThis category indicates that the media should be treated as highly unreliable, with the assumption leaning strongly toward artificial generation.",
        "Media classified within 70-80% probability demonstrates a concentration of deepfake-specific anomalies. Examples include irregular frame transitions, inconsistencies in background sharpness compared to the subject, and noticeable deviations in facial symmetry over time. These issues are consistent with known generative model limitations.\n\nThe system’s findings provide persuasive evidence of manipulation, although the possibility of rare false positives still exists.",
        "The analysis shows a persistent presence of generative artifacts across the examined content. Smooth but unnatural textures, mismatched lighting gradients, and jittering in facial outlines were documented. These patterns closely match those produced by popular AI synthesis methods.\n\nAt this stage, the evidence is strong enough to assume manipulation unless counter-evidence can be demonstrated.",
        "With a 70-80% confidence score, the system strongly suspects deepfake involvement. The probability is supported by repeated anomalies in temporal consistency—such as fluctuating brightness across frames and distortions during rapid motion sequences. These cues rarely occur in authentic recordings without external interference.\n\nThis range is best considered a high-confidence classification of AI generation, warranting serious caution when relying on the media.",
        "Indicators found in this probability range include abnormal texture blending, reduced detail in natural facial pores, and slight geometric distortions around sensitive regions like eyes and lips. Such markers are characteristic of AI-based tampering.\n\nWhile authenticity cannot be entirely ruled out, the concentration and persistence of these cues strongly favor the conclusion of manipulation.",
        "The 70-80% probability range reflects significant evidence of digital synthesis. The system’s detection covered unnatural shading in skin regions, repetitive noise patterns, and misaligned background motion. These collectively form a robust case that the content has been artificially constructed.\n\nAt this stage, trust in the media should be minimal unless external validation demonstrates otherwise."
    ],

    "80-90": [
        "In the 80-90% bracket, the analysis found compelling and repeated signs of AI synthesis. Key anomalies include irregular lip synchronization, unnatural fluidity in facial transitions, and unrealistic shadow progression across scenes. These are not sporadic but systematic, pointing decisively toward a synthetic source.\n\nThis category represents a very high probability of manipulation, and authenticity should be presumed compromised.",
        "Content in this range shows overwhelming evidence of digital alteration. Detected artifacts included highly uniform skin patterns, unnatural distortions around hairlines, and inconsistent rendering of reflective surfaces like glasses or jewelry. Such anomalies are characteristic of advanced deepfake models.\n\nThe confidence level here leaves little room for natural explanations, indicating the media is almost certainly manipulated.",
        "The system documented repeated instances of geometric warping, texture instability, and abnormal lighting effects that are strongly associated with AI generation. These patterns extended across multiple frames, reinforcing the credibility of the finding.\n\nAt this stage, the probability of authenticity is extremely low. The content should be treated as deepfake unless definitively disproven.",
        "Media within this category demonstrates anomalies too pronounced to be dismissed as compression or sensor errors. For instance, inconsistent eye motion relative to head movement and unstable rendering of fine facial features were observed. Such flaws consistently align with synthetic manipulation.\n\nGiven the intensity of the anomalies, this range implies very high suspicion of artificial generation.",
        "The 80-90% range reflects severe and pervasive anomalies across both static and dynamic aspects of the content. The system found irregularities in micro-expression timing, shadow orientation, and background continuity—each a known marker of AI tampering.\n\nAt this level, users should treat the media as manipulated and unreliable unless independent, credible verification proves otherwise.",
        "Confidence in manipulation is extremely high at this level. Detected evidence included unrealistic texture smoothing across facial regions, misalignment during fast movements, and repeated distortion artifacts that are not explainable by natural conditions.\n\nThe probability here indicates strong convergence of multiple deepfake indicators, leaving very little chance of authenticity."
    ],

    "90-100": [
        "At the 90-100% level, the system’s analysis leaves virtually no doubt that the media is AI-generated. The evidence is overwhelming and covers all key detection domains, from pixel-level inconsistencies to semantic mismatches in motion. Detected issues included warped geometry, unstable rendering of facial details, and unnatural synchronization across audio-visual channels.\n\nThis classification should be treated as definitive: the content is fabricated by AI.",
        "Media in this range demonstrates such pervasive anomalies that authenticity can effectively be ruled out. The system observed distorted micro-expressions, irregular lip movement, and inconsistencies in natural eye tracking—all hallmarks of synthetic generation.\n\nThe probability score here reflects conclusive identification of manipulation, with negligible chance of a false positive.",
        "The 90-100% category represents near-certainty of AI involvement. The content displayed repeated and severe artifacts including jittering outlines, inconsistent texture detail, and background elements that fail to remain stable across frames.\n\nAt this stage, the conclusion is clear: the material is artificially constructed.",
        "Evidence for manipulation is overwhelming at this probability level. Indicators include pervasive instability in lighting across frames, unnatural rendering of fine details such as hair strands, and systemic inconsistencies in depth cues. These are characteristic outputs of generative adversarial models.\n\nSuch findings make it virtually impossible for the content to be authentic.",
        "When classified in the 90-100% range, the system’s assessment is that the media is definitively manipulated. Every examined region displayed markers of synthesis—from unnatural color propagation to structural inconsistencies across temporal sequences.\n\nThis confidence bracket signals the highest degree of certainty, aligning with both automated and human review standards.",
        "At this level, the verdict is conclusive. The media contains overwhelming forensic signatures of deepfake creation, including unstable geometry, pixel artifacts consistent with GAN upscaling, and illogical transitions in natural motion. These anomalies extend consistently across the dataset.\n\nThe result is a near-absolute certainty that the content is fabricated using AI-based methods."
    ]
    },

    "Real": {
        "50-60": [
            "The system leans toward authenticity but with moderate confidence. Natural sensor noise patterns and realistic lighting distribution were observed, which point to genuine capture. However, minor inconsistencies—possibly due to compression or environmental conditions—lowered the confidence score.\n\nThis range should be treated as a cautious affirmation of authenticity, suggesting the media is likely real but deserving of further scrutiny.",
            "Our analysis suggests the content is probably authentic, although the verdict is not ironclad. The presence of natural texture transitions, consistent depth cues, and organic motion blur support a real classification. However, the lowered confidence reflects small anomalies likely tied to technical degradation.\n\nThis means the media is best viewed as genuine but not beyond doubt.",
            "The 50-60% range reflects ambiguous evidence leaning toward authenticity. The system noted coherent geometry and realistic reflection patterns, but the overall signal was weakened by artifacts associated with compression. These effects create uncertainty in classification.\n\nWhile manipulation cannot be ruled out, the data at hand favors authenticity more than synthetic origin.",
            "Media in this confidence range demonstrates enough real-world characteristics to justify a leaning toward authenticity. Features such as natural variation in facial tones, consistent shading, and organic noise align with genuine camera captures. Still, faint irregularities reduce certainty.\n\nThis category indicates probable authenticity, but caution is warranted in highly sensitive use cases.",
            "The analysis finds a moderate probability of real origin. Evidence such as continuous background sharpness, stable geometry, and plausible shadow gradients all support authenticity. The lower score, however, reflects the possibility of confounding factors like poor lighting or low-resolution input.\n\nThis outcome should be interpreted as more authentic than fake, but not with full confidence."
        ],

        "60-70": [
            "The content falls into a confidence range where authenticity is strongly supported. Natural sensor signatures—like coherent noise distribution and consistent optical distortions—were detected. These features are difficult to replicate artificially and thus strengthen the case for genuine origin.\n\nWhile minor irregularities exist, they appear more consistent with technical recording imperfections than deliberate manipulation.",
            "At the 60-70% range, the findings suggest the media is real with high probability. Smooth transitions in texture, stable lighting gradients, and correct motion consistency align with characteristics of genuine capture. The anomalies observed are mild and unlikely to indicate tampering.\n\nThis classification leans confidently toward authenticity, though independent validation is always recommended in critical scenarios.",
            "The probability score in this bracket indicates a strong likelihood of authenticity. The system documented realistic eye reflections, unaltered micro-textures, and consistent frame-to-frame motion—all hallmarks of real-world capture.\n\nAlthough not an absolute guarantee, the accumulated evidence favors authenticity convincingly.",
            "Media classified within this confidence level exhibits most of the qualities associated with genuine content. Organic depth perception, unaltered pixel noise, and geometrically consistent facial structures provide reassurance. Minor noise was observed, but not at levels suggestive of manipulation.\n\nThis range suggests the media can be trusted with reasonable confidence.",
            "The 60-70% confidence range reflects a growing trust in authenticity. Features such as accurate light refraction, consistent focus transitions, and natural edge sharpness are all consistent with real data. The relatively minor anomalies present are unlikely to indicate deepfake synthesis.\n\nThus, this level provides a solid indication that the content is authentic."
        ],

        "70-80": [
            "The system finds strong evidence of authenticity. Media within this probability band demonstrates stable natural textures, reliable lighting coherence, and realistic sensor-specific noise. Such traits are rarely produced convincingly by generative models.\n\nAt this stage, the analysis suggests the content is highly likely to be genuine, with minimal concern for manipulation.",
            "With 70-80% confidence, the evidence favors authenticity strongly. Natural facial micro-expressions, unaltered dynamic shadows, and organic depth cues were consistently observed throughout the footage. These are difficult for AI systems to fabricate convincingly.\n\nWhile absolute certainty is rare, the indicators make authenticity the dominant conclusion.",
            "The probability in this range indicates the content demonstrates clear real-world consistency. Motion stability, unbroken geometric alignment, and accurate environmental reflections all support genuine capture.\n\nAny anomalies detected are insignificant compared to the overwhelming natural cues, making this content highly trustworthy.",
            "Content in this range reveals qualities strongly tied to authentic recordings. Realistic lens distortion, organic imperfections in texture, and plausible background interaction were all documented. These features reduce the likelihood of AI synthesis significantly.\n\nThis probability bracket therefore suggests reliable authenticity.",
            "The system’s findings reflect a robust case for authenticity at this confidence level. Notable natural traits include realistic shadow softening, continuous motion blur, and accurate light reflection across multiple surfaces.\n\nThese observations strongly reinforce the conclusion that the content is authentic."
        ],

        "80-90": [
            "Media in this confidence bracket demonstrates overwhelming evidence of authenticity. The analysis detected organic noise distribution, natural motion patterns, and consistent facial geometry across frames. These are highly reliable cues for genuine capture.\n\nThis level of probability suggests the content can be trusted in most contexts as authentic.",
            "At the 80-90% range, the evidence is decisively in favor of real origin. Natural texture irregularities, consistent eye tracking, and physically accurate shading patterns leave little room for doubt. These elements are beyond what typical deepfake systems can mimic at scale.\n\nThe analysis strongly affirms the media’s authenticity.",
            "The findings in this probability range point to very high confidence in authenticity. Features such as unbroken environmental consistency, plausible lighting continuity, and unaltered micro-detail in skin textures all strengthen the case for genuineness.\n\nThis result indicates the content is authentic with minimal chance of error.",
            "The system observed strong forensic signatures of authenticity, including realistic frame timing, consistent audio-visual synchronization, and plausible background stability. Such traits leave little basis for suspicion of manipulation.\n\nThis range indicates that the content can be regarded as highly authentic.",
            "The 80-90% confidence range represents a near-certain classification of authenticity. Indicators such as organic shading, consistent eye reflections, and realistic motion fluidity support this conclusion. Any irregularities present are well within natural variation.\n\nThus, this level reflects a strong assurance of authenticity."
        ],

        "90-100": [
            "At the 90-100% level, the analysis is conclusive: the media is authentic. The content demonstrates consistent sensor signatures, unaltered texture fidelity, and realistic environmental interaction across all frames. Such comprehensive alignment with natural data eliminates reasonable doubt.\n\nThis verdict should be treated as definitive, affirming the media as genuine.",
            "Media in this bracket exhibits overwhelming natural indicators. Every tested forensic domain—from lighting and geometry to noise and reflections—aligns perfectly with authentic capture. No anomalies suggesting manipulation were observed.\n\nThis confidence range signals near-absolute certainty of real origin.",
            "The probability at this level reflects the strongest possible affirmation of authenticity. Organic imperfections, depth-consistent textures, and flawless motion timing were consistently documented. These traits cannot realistically be reproduced by synthetic methods at present.\n\nThis classification should be taken as a definitive declaration of authenticity.",
            "The system’s findings conclusively support authenticity at the 90-100% range. Evidence included realistic optical distortions, coherent environmental alignment, and stable micro-textures across frames. These findings collectively dismiss the possibility of manipulation.\n\nThis range indicates the highest possible trust in authenticity.",
            "At this confidence level, authenticity is virtually certain. The media demonstrates flawless alignment with expected real-world properties, including true-to-life reflection physics and natural motion blur. No synthetic markers were detected.\n\nThis probability range confirms the content is genuine beyond reasonable doubt."
        ]
    }
}

class PDF(FPDF):
    """ Custom PDF class to create a header and footer """
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'Certi-Fact Forensic Analysis Report', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', 0, 0, 'C')

def generate_analysis_report(result_data):
    """
    Generates a dynamic PDF report from analysis result data.
    """
    pdf = PDF()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)

    # --- Add Dynamic Data from the Analysis ---
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Analysis Summary', 0, 1)
    pdf.set_font('Arial', '', 12)

    summary_data = {
        "Original Filename": result_data.get('filename', 'N/A'),
        "Analysis Verdict": result_data.get('label', 'N/A'),
        "Confidence Score": f"{result_data.get('confidence_percent', 0):.2f}%",
        "Analysis Timestamp": result_data.get('timestamp').strftime('%Y-%m-%d %H:%M:%S UTC')
    }

    for key, value in summary_data.items():
        pdf.set_font('Arial', 'B', 11)
        pdf.cell(50, 8, key + ":", 0, 0)
        pdf.set_font('Arial', '', 11)
        pdf.cell(0, 8, value, 0, 1)
    
    pdf.ln(10)

    # --- Select and Add Randomized Report Text ---
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Detailed Findings', 0, 1)
    pdf.set_font('Arial', '', 11)

    confidence = result_data.get('confidence_percent', 0)
    label = result_data.get('label', 'Real')
    
    bracket = f"{int(confidence // 10) * 10}-{int(confidence // 10) * 10 + 10}"
    
    text_pool = REPORT_TEXT_POOLS.get(label, {}).get(bracket, ["A standard report could not be generated for this confidence level."])
    
    selected_text = random.choice(text_pool)
    
    pdf.multi_cell(0, 6, selected_text)
    pdf.ln(10)

    # --- Add Thumbnail Image (Using the robust version) ---
    pdf.set_font('Arial', 'B', 12)
    pdf.cell(0, 10, 'Analyzed Media Thumbnail', 0, 1)
    
    try:
        thumbnail_url = result_data.get('thumbnail_url')
        if thumbnail_url and isinstance(thumbnail_url, str):
            base_dir = os.path.dirname(__file__)
            thumbnail_filename = os.path.basename(thumbnail_url)
            thumbnail_path = os.path.join(base_dir, 'uploads', thumbnail_filename)

            if os.path.exists(thumbnail_path):
                pdf.image(thumbnail_path, x=(210-75)/2, w=75)
            else:
                pdf.set_font('Arial', 'I', 10)
                pdf.cell(0, 10, '[Thumbnail image not available]', 0, 1, 'C')
                print(f"🔥 WARNING: Thumbnail file not found at path: {thumbnail_path}")
        else:
            pdf.set_font('Arial', 'I', 10)
            pdf.cell(0, 10, '[Thumbnail not recorded in database]', 0, 1, 'C')

    except Exception as e:
        print(f"🔥 SEVERE: Error adding thumbnail to PDF: {e}")
        pdf.set_font('Arial', 'I', 10)
        pdf.cell(0, 10, '[Error rendering thumbnail]', 0, 1, 'C')

    return bytes(pdf.output())