import React, { useState, useRef } from "react";
import "./components.css";

export default function CVUpload({ file, setFile, storageError }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
  }

  function handleRemoveFile(e) {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    // Only cancel dragging if we are leaving the dropzone entirely (not entering a child)
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }

  return (
    <section className="cv-upload">
      <h2>Upload Your CV</h2>
      <p className="upload-subtitle">PDF or DOCX, max 10MB</p>

      <label
        htmlFor="cv-file"
        className={`upload-dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <>
            <div className="upload-icon">📄</div>
            <p className="upload-text">
              <strong>{file.name}</strong>
              <button
                type="button"
                className="remove-file-btn"
                onClick={handleRemoveFile}
                title="Remove file"
              >
                ✕
              </button>
            </p>
            <span className="upload-hint">Click to replace</span>
          </>
        ) : (
          <>
            <div className="upload-icon">⬆️</div>
            <p className="upload-text">
              <strong>Drop your CV here</strong> or click to browse
            </p>
            <span className="upload-hint">Supports PDF and DOCX files</span>
          </>
        )}

        <input
          id="cv-file"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          hidden
          ref={fileInputRef}
        />
      </label>

      {storageError && (
        <div className="upload-warning">
          ⚠️ File too large to save for refresh.
        </div>
      )}
    </section>
  );
}
