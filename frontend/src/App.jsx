import jsPDF from "jspdf";
import { useState } from "react";
import "./App.css";
import { FaHeartbeat, FaUpload } from "react-icons/fa";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const uploadFile = async () => {
    if (!file) {
      alert("Please choose a file");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setText(data.text);
      setAnalysis(data.analysis);
    } catch (err) {
      alert("Error connecting to backend.");
      console.error(err);
    }

    setLoading(false);
  };

  const askAI = async () => {
  if (!question.trim()) {
    alert("Please enter a question.");
    return;
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        report_text: text,
        question: question,
      }),
    });

    const data = await response.json();
    setAnswer(data.answer);
  } catch (error) {
    console.error(error);
    alert("Failed to get AI response.");
  }
};

  const healthScore = analysis?.health_score || (
    analysis?.risk_level === "Low"
      ? 90
      : analysis?.risk_level === "Medium"
      ? 70
      : analysis?.risk_level === "High"
      ? 45
      : 0
  );

  return (
    <div className="app">

      <h1>
        <FaHeartbeat className="logo" />
        AI Health Companion
      </h1>

      <p className="subtitle">
        Upload your medical report and receive AI-powered health insights.
      </p>

      <div className="upload-card">

        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button onClick={uploadFile}>
          <FaUpload /> Analyze Report
        </button>

      </div>

      {loading && (
        <div className="loading">
          🤖 AI is analyzing your report...
        </div>
      )}

      {analysis && (
        <div className="card health-card">

          <h2>❤️ Overall Health</h2>

          <h1>{healthScore}/100</h1>

          <h3>
            {analysis.risk_level === "Low" && "🟢 Low Risk"}
            {analysis.risk_level === "Medium" && "🟡 Medium Risk"}
            {analysis.risk_level === "High" && "🔴 High Risk"}
          </h3>

        </div>
      )}

      {analysis && (
        <div className="card">
          <h2>📋 Quick Summary</h2>
          <p>{analysis.summary}</p>
        </div>
      )}

      {analysis && (
        <div className="card">

          <h2>⚠️ Needs Attention</h2>

          {(analysis.abnormal_values || []).length === 0 ? (
            <p>✅ No abnormal values detected.</p>
          ) : (
            <ul>
              {analysis.abnormal_values.map((item, index) => (
                <li key={index}>
                  <strong>{item.test_name}</strong>

                  <br />

                  <b>Result:</b> {item.result}

                  <br />

                  <b>Reference:</b> {item.reference_range}

                  <br />

                  <b>Status:</b> {item.interpretation}
                </li>
              ))}
            </ul>
          )}

        </div>
      )}

      {analysis && (
        <div className="card">

          <h2>💡 Recommendations</h2>

          <ul>
            {(analysis.recommendations || []).map((item, index) => (
              <li key={index}>✅ {item}</li>
            ))}
          </ul>

        </div>
      )}

      {analysis && (
        <div className="card">

          <h2>🥗 Diet Suggestions</h2>

          <ul>
            {(analysis.diet || []).map((item, index) => (
              <li key={index}>🥬 {item}</li>
            ))}
          </ul>

        </div>
      )}

      {analysis && (
        <div className="card">

          <h2>🚫 Foods To Avoid</h2>

          <ul>
            {(analysis.foods_to_avoid || []).map((item, index) => (
              <li key={index}>❌ {item}</li>
            ))}
          </ul>

        </div>
      )}

      {analysis && (
        <div className="card">

          <h2>🏃 Exercise & Lifestyle</h2>

          <ul>
            {(analysis.exercise || []).map((item, index) => (
              <li key={index}>🏃 {item}</li>
            ))}
          </ul>

        </div>
      )}

      {analysis && (
        <div className="card">

          <h2>👨‍⚕️ Doctor Advice</h2>

          <p>{analysis.doctor_visit}</p>

        </div>
      )}

      {analysis && (
        <div className="card">

          <h2>❓ Questions To Ask Your Doctor</h2>

          <ul>
            {(analysis.questions_for_doctor || []).map((item, index) => (
              <li key={index}>❓ {item}</li>
            ))}
          </ul>

        </div>
      )}

      {text && (
        <div className="card">

          <h2>📄 Original Report</h2>

          <button onClick={() => setShowReport(!showReport)}>
            {showReport ? "Hide Report ▲" : "View Original Report ▼"}
          </button>

          {showReport && <pre>{text}</pre>}

        </div>
      )}
      {analysis && (
  <div className="card">
    <h2>💬 Ask AI About Your Report</h2>

    <input
      type="text"
      placeholder="Example: Can I eat eggs?"
      value={question}
      onChange={(e) => setQuestion(e.target.value)}
      className="chat-input"
    />

    <button onClick={askAI} style={{ marginTop: "15px" }}>
      Ask AI
    </button>

    {answer && (
      <div style={{ marginTop: "20px" }}>
        <h3>🤖 AI Answer</h3>
        <p>{answer}</p>
      </div>
    )}
  </div>
)}

      <footer className="footer">
        Made with ❤️ using React + FastAPI + Gemini AI
      </footer>

    </div>
  );
}

export default App;