import React, { useState, useRef } from "react";
import "./components.css";

// Error type definitions
const ERROR_TYPES = {
  INVALID_FILE_TYPE: 'invalid_file_type',
  FILE_TOO_LARGE: 'file_too_large',
  EMPTY_FILE: 'empty_file',
  CORRUPTED_FILE: 'corrupted_file',
  UNREADABLE_PDF: 'unreadable_pdf',
  PDF_PROCESSING_ERROR: 'pdf_processing_error',
  DOCX_PROCESSING_ERROR: 'docx_processing_error',
  UNSUPPORTED_FORMAT: 'unsupported_format',
  SERVER_ERROR: 'server_error',
  NETWORK_ERROR: 'network_error'
};

// Error messages with guidance
const ERROR_MESSAGES = {
  [ERROR_TYPES.INVALID_FILE_TYPE]: {
    title: 'Invalid File Type',
    message: 'Please upload a PDF, DOCX, or DOC file.',
    actionText: 'Choose a supported file format and try again.'
  },
  [ERROR_TYPES.FILE_TOO_LARGE]: {
    title: 'File Too Large',
    message: 'Your CV exceeds the 10MB size limit.',
    actionText: 'Please upload a smaller file or compress your images.'
  },
  [ERROR_TYPES.EMPTY_FILE]: {
    title: 'Empty File',
    message: 'The file you uploaded is empty.',
    actionText: 'Please upload a CV that contains content.'
  },
  [ERROR_TYPES.CORRUPTED_FILE]: {
    title: 'Corrupted File',
    message: 'The file appears to be corrupted or damaged.',
    actionText: 'Try saving the file again and re-uploading it.'
  },
  [ERROR_TYPES.UNREADABLE_PDF]: {
    title: 'Unreadable PDF',
    message: 'The PDF file could not be read. It may be an image-based or scanned PDF.',
    actionText: 'Try converting your PDF to text or use a different file.'
  },
  [ERROR_TYPES.PDF_PROCESSING_ERROR]: {
    title: 'PDF Processing Error',
    message: 'An error occurred while reading your PDF file.',
    actionText: 'Try saving the file with a different PDF writer and upload again.'
  },
  [ERROR_TYPES.DOCX_PROCESSING_ERROR]: {
    title: 'DOCX Processing Error',
    message: 'An error occurred while reading your DOCX file.',
    actionText: 'Try saving the file in a newer Word format and upload again.'
  },
  [ERROR_TYPES.UNSUPPORTED_FORMAT]: {
    title: 'Format Not Supported',
    message: 'This file format is not supported.',
    actionText: 'Convert your file to PDF or DOCX and try again.'
  },
  [ERROR_TYPES.SERVER_ERROR]: {
    title: 'Server Error',
    message: 'An error occurred on the server while processing your file.',
    actionText: 'Please try again in a moment. If the problem persists, contact support.'
  },
  [ERROR_TYPES.NETWORK_ERROR]: {
    title: 'Network Error',
    message: 'Connection failed while uploading your CV.',
    actionText: 'Check your internet connection and try again.'
  }
};

export default function CVUpload({ file, setFile, storageError, onUploadSuccess = null }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);

  // Validate file locally before upload
  function validateFileLocally(selectedFile) {
    const ALLOWED_EXTENSIONS = ['pdf', 'doc', 'docx'];
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

    // Check file extension
    const fileName = selectedFile.name.toLowerCase();
    const fileExt = fileName.substring(fileName.lastIndexOf('.') + 1);
    
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      setUploadError({
        code: ERROR_TYPES.INVALID_FILE_TYPE,
        ...ERROR_MESSAGES[ERROR_TYPES.INVALID_FILE_TYPE]
      });
      return false;
    }

    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      setUploadError({
        code: ERROR_TYPES.FILE_TOO_LARGE,
        ...ERROR_MESSAGES[ERROR_TYPES.FILE_TOO_LARGE],
        fileSizeMB: (selectedFile.size / (1024 * 1024)).toFixed(2)
      });
      return false;
    }

    // Check if file is truly empty
    if (selectedFile.size === 0) {
      setUploadError({
        code: ERROR_TYPES.EMPTY_FILE,
        ...ERROR_MESSAGES[ERROR_TYPES.EMPTY_FILE]
      });
      return false;
    }

    return true;
  }

  // Upload file to backend
  async function uploadFileToBackend(selectedFile) {
    try {
      setIsUploading(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('file', selectedFile);

      // Use relative path for API endpoint
      // This works for both local development and Vercel deployment
      const response = await fetch('/api/upload-cv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Server returned an error
        const errorCode = data.error_code || ERROR_TYPES.SERVER_ERROR;
        const errorConfig = ERROR_MESSAGES[errorCode] || {
          title: 'Upload Error',
          message: data.message || 'Unknown error occurred',
          actionText: 'Please try again.'
        };

        setUploadError({
          code: errorCode,
          ...errorConfig,
          serverDetails: data.details || {}
        });
        return false;
      }

      // Success
      setFile(selectedFile);
      setUploadedFileData(data.data);
      setUploadError(null);

      // Call parent callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(selectedFile, data.data);
      }

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError({
        code: ERROR_TYPES.NETWORK_ERROR,
        ...ERROR_MESSAGES[ERROR_TYPES.NETWORK_ERROR],
        errorDetail: error.message
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  }

  async function handleFileChange(e) {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // First validate locally
    if (!validateFileLocally(selectedFile)) {
      return;
    }

    // Then upload to backend
    await uploadFileToBackend(selectedFile);
  }

  async function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (!droppedFile) return;

    // Validate and upload
    if (!validateFileLocally(droppedFile)) {
      return;
    }

    await uploadFileToBackend(droppedFile);
  }

  function handleRemoveFile(e) {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    setUploadedFileData(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function handleRetry() {
    // Reset error and trigger file picker again
    setUploadError(null);
    fileInputRef.current?.click();
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  }

  return (
    <section className="cv-upload">
      <h2>Upload Your CV</h2>
      <p className="upload-subtitle">PDF or DOCX, max 10MB</p>

      <label
        htmlFor="cv-file"
        className={`upload-dropzone ${isDragging ? "dragging" : ""} ${
          isUploading ? "uploading" : ""
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file && !uploadError ? (
          <>
            <div className="upload-icon">✓</div>
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
            <div className="upload-icon">{isUploading ? "⏳" : "⬆️"}</div>
            <p className="upload-text">
              <strong>
                {isUploading ? "Uploading..." : "Drop your CV here"}
              </strong>
              {!isUploading && " or click to browse"}
            </p>
            <span className="upload-hint">
              {isUploading
                ? "Please wait..."
                : "Supports PDF and DOCX files"}
            </span>
          </>
        )}

        <input
          id="cv-file"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          hidden
          ref={fileInputRef}
          disabled={isUploading}
        />
      </label>

      {/* Upload Error Display */}
      {uploadError && (
        <div className="upload-error">
          <div className="error-icon">⚠️</div>
          <div className="error-content">
            <h3 className="error-title">{uploadError.title}</h3>
            <p className="error-message">{uploadError.message}</p>
            <p className="error-action">{uploadError.actionText}</p>
          </div>
          <button
            className="btn secondary retry-btn"
            onClick={handleRetry}
            disabled={isUploading}
            title="Retry uploading a file"
          >
            Retry
          </button>
        </div>
      )}

      {/* Storage Error */}
      {storageError && !uploadError && (
        <div className="upload-warning">
          ⚠️ File too large to save for refresh. Session data may not persist on page reload.
        </div>
      )}

      {/* Success Feedback */}
      {file && !uploadError && uploadedFileData && (
        <div className="upload-success">
          <div className="success-icon">✓</div>
          <div className="success-content">
            <p className="success-text">
              <strong>{uploadedFileData.filename}</strong>
            </p>
            <p className="success-meta">
              {uploadedFileData.file_size_mb}MB • {uploadedFileData.file_type.toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
