import React, { useState } from "react";
import "./components.css";

export default function CVUpload() {
  const [fileName, setFileName] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState(null);

  function handleFileChange(e) {
    const f = e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    // Try to read text files for a small preview; ignore binary formats
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result.slice(0, 1000));
    reader.onerror = () => setPreview(null);
    if (f.type.startsWith("text/") || f.name.endsWith(".md")) {
      reader.readAsText(f);
    } else {
      setPreview(null);
    }
    setStatus(null);
  }

  function handleUpload() {
    if (!fileName) {
      setStatus("Please choose a file first.");
      return;
    }
    // For now we simulate upload since backend endpoint is not present.
    setStatus("Uploading...");
    setTimeout(() => {
      setStatus("Upload complete (simulated).");
    }, 800);
  }

  return (
    <section className="cv-upload">
      <h2>CV Upload</h2>
      <div className="upload-box">
        <input type="file" id="cvfile" onChange={handleFileChange} />
        <button className="btn primary" onClick={handleUpload}>Upload</button>
      </div>

      <div className="upload-meta">
        <div><strong>Selected:</strong> {fileName || "No file chosen"}</div>
        {status && <div className="status">{status}</div>}
      </div>

      {preview && (
        <div className="preview">
          <h4>Preview (first 1000 chars)</h4>
          <pre>{preview}</pre>
        </div>
      )}
    </section>
  );
}
