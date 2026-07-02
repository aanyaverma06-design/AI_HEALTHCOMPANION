from fastapi import FastAPI, UploadFile, File

app = FastAPI()

@app.get("/")
def home():
    return {"message": "AI Health Companion"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    content = await file.read()

    return {
        "filename": file.filename,
        "content": content.decode("utf-8")
    }