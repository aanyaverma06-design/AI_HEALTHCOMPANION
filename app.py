from pydantic import BaseModel
from chat_service import ask_ai
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pdf_utils import extract_text_from_pdf
from gemini_service import analyze_report
import os

class ChatRequest(BaseModel):
    report_text: str
    question: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ai-healthcompanion.vercel.app",
    ],
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

    print(ai_summary)   # 👈 Add this line

    return {
        "message": "File uploaded successfully",
        "filename": file.filename,
        "saved_to": file_path,
        "text": extracted_text,
        "analysis": ai_summary
    }

@app.post("/chat")
async def chat(request: ChatRequest):

    answer = ask_ai(
        request.report_text,
        request.question
    )

    return {
        "answer": answer
    }