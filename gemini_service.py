import json
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Load Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")


def analyze_report(report_text):

    prompt = f"""
You are an expert AI healthcare assistant.

Analyze the following medical report.

Return ONLY valid JSON.

{{
  "health_score": 0,
  "risk_level": "",

  "summary": "",

  "abnormal_values": [
    {{
      "test_name": "",
      "result": "",
      "reference_range": "",
      "interpretation": ""
    }}
  ],

  "recommendations": [],

  "diet": [],

  "foods_to_avoid": [],

  "exercise": [],

  "doctor_visit": "",

  "questions_for_doctor": []
}}

RULES:

1. Return ONLY JSON.
2. No markdown.
3. No ```json.
4. Health score must be between 0 and 100.
5. Risk level must be Low, Medium or High.
6. Mention ONLY abnormal parameters.
7. Recommendations should be short.
8. Diet should contain foods to eat.
9. foods_to_avoid should contain foods to avoid.
10. exercise should contain 3-5 lifestyle suggestions.
11. doctor_visit should tell whether immediate consultation is required.
12. questions_for_doctor should contain useful questions the patient can ask.

Medical Report:

{report_text}
"""

    response = model.generate_content(prompt)

    try:
        cleaned = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        data = json.loads(cleaned)

        return data

    except Exception as e:

        print("\n========== GEMINI ERROR ==========")
        print(e)
        print("\nRaw Gemini Response:\n")
        print(response.text)
        print("==================================\n")

        return {
            "summary": response.text,
            "abnormal_values": [],
            "recommendations": [],
            "risk_level": "Unknown"
        }