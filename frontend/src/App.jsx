import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) {
      alert("Please choose a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.summary);
    } catch (err) {
      alert("Backend is not running!");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          🩺 AI Health Companion
        </h1>
      </nav>

      {/* Hero */}
      <div className="text-center mt-10">

        <h2 className="text-5xl font-bold">
          Understand Medical Reports
          <span className="text-cyan-400"> with AI</span>
        </h2>

        <p className="text-gray-400 mt-4">
          Upload your report and get AI-powered insights instantly.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="bg-white text-black rounded p-2"
          />

          <button
            onClick={uploadFile}
            className="bg-cyan-500 hover:bg-cyan-600 px-6 py-2 rounded-lg"
          >
            Analyze Report
          </button>
        </div>

      </div>

      {/* Result Card */}

      <div className="max-w-5xl mx-auto mt-16">

        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">

          <h2 className="text-3xl font-bold text-cyan-400 mb-6">
            🤖 AI Analysis
          </h2>

          {loading ? (
            <p className="text-xl animate-pulse">
              Analyzing Report...
            </p>
          ) : (
            <pre className="whitespace-pre-wrap">
              {result}
            </pre>
          )}

        </div>

      </div>

    </div>
  );
}

export default App;