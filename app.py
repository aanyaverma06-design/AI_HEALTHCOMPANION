
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pdf_utils import extract_text_from_pdf
from gemini_service import analyze_report
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.get("/")
def home():
    return {"message": "AI Health Companion"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    # Save uploaded file
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    extracted_text = ""

    if file.filename.lower().endswith(".pdf"):
        extracted_text = extract_text_from_pdf(file_path)

    elif file.filename.lower().endswith(".txt"):
        with open(file_path, "r", encoding="utf-8") as f:
            extracted_text = f.read()
    ai_summary = analyze_report(extracted_text)

    return {
    
    "message": "File uploaded successfully",
    "filename": file.filename,
    "saved_to": file_path,
    "text": extracted_text,
    "summary": ai_summary
}
    