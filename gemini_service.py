import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load model
model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_report(report_text):
    prompt = f"""
You are an AI medical assistant.

Analyze the following medical report.

Return your answer in this format:

📋 Summary
- Explain the report in simple language.

⚠️ Abnormal Values
- Mention abnormal values if present.

💡 Health Suggestions
- Give general lifestyle suggestions.

❗ Disclaimer
- Mention this is NOT a medical diagnosis.

Medical Report:
{report_text}
"""

    response = model.generate_content(prompt)
    return response.text