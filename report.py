from fpdf import FPDF
from datetime import datetime
import os


def create_report(patient_name, result, confidence, heatmap_path=None):

    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", "B", 18)
    pdf.cell(0, 10, "AI Brain Tumor Diagnostic Report", ln=True)

    pdf.ln(5)

    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Patient: {patient_name}", ln=True)
    pdf.cell(0, 10, f"Date: {datetime.now().strftime('%Y-%m-%d')}", ln=True)

    pdf.ln(5)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Diagnosis", ln=True)

    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 10, f"Tumor Type: {result}", ln=True)
    pdf.cell(0, 10, f"Confidence: {confidence:.2f}%", ln=True)

    # Risk
    risk = "LOW"
    if confidence > 90:
        risk = "HIGH"
    elif confidence > 75:
        risk = "MEDIUM"

    pdf.cell(0, 10, f"Risk Level: {risk}", ln=True)

    pdf.ln(10)

    # Heatmap
    if heatmap_path:
        full_path = os.path.join("static", heatmap_path)
        if os.path.exists(full_path):
            try:
                pdf.image(full_path, x=10, w=100)
            except:
                pass

    pdf.ln(10)

    pdf.multi_cell(
        0,
        10,
        "AI-assisted detection. Please consult a certified radiologist."
    )

    file_path = "static/diagnosis_report.pdf"
    pdf.output(file_path)

    return "diagnosis_report.pdf"