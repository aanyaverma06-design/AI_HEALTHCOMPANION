import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")


def ask_ai(report_text, question):

    prompt = f"""
You are an expert medical AI assistant.

Medical Report:

{report_text}

Patient Question:

{question}

Answer in simple language.

Keep it under 150 words.

If the answer requires a doctor,
clearly mention it.

Do not make up facts not supported by the report.
"""

    response = model.generate_content(prompt)

    return response.text