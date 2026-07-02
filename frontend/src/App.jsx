import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("http://127.0.0.1:8000/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

console.log(data);

setText(data.text);
  };

  return (
    <div className="container">
      <h1>🩺 AI Health Companion</h1>

      <p>Upload your medical report and extract its text.</p>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={uploadFile}>
        Upload Medical Report
      </button>

      <h2>Extracted Text</h2>

      <pre>{text}</pre>
    </div>
  );
}

export default App;