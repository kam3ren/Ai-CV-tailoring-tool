import { useState, useEffect } from "react";
import "./Landing.css";
import "./Upload.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CVUpload from "../components/CVUpload";
import JobDescription from "../components/JobDescription";
import CustomizePrompt from "../components/AIprompt";

export default function Upload() {
    // CV file state with session storage persistence
    const [file, setFile] = useState(() => {
        const savedFile = sessionStorage.getItem("cvFile");
        if (savedFile) {
            try {
                const { name, type, content } = JSON.parse(savedFile);
                const arr = content.split(',');
                const mime = arr[0].match(/:(.*?);/)[1];
                const bstr = atob(arr[1]);
                let n = bstr.length;
                const u8arr = new Uint8Array(n);
                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], name, { type });
            } catch (e) {
                console.error("Error restoring file:", e);
                return null;
            }
        }
        return null;
    });

    // Uploaded file metadata from backend
    const [uploadedFileData, setUploadedFileData] = useState(() => {
        const saved = sessionStorage.getItem("uploadedFileData");
        return saved ? JSON.parse(saved) : null;
    });

    const [storageError, setStorageError] = useState(false);

    // Job description state
    const [jobDesc, setJobDesc] = useState(() => {
        return sessionStorage.getItem("jobDesc") || "";
    });

    // Track if CV upload was successful
    const [cvUploadSuccess, setCvUploadSuccess] = useState(() => {
        return sessionStorage.getItem("cvUploadSuccess") === "true";
    });

    // Persist job description
    useEffect(() => {
        sessionStorage.setItem("jobDesc", jobDesc);
    }, [jobDesc]);

    // Persist CV file and metadata
    useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    const fileData = {
                        name: file.name,
                        type: file.type,
                        content: reader.result
                    };
                    sessionStorage.setItem("cvFile", JSON.stringify(fileData));
                    setStorageError(false);
                } catch (e) {
                    console.warn("File too large to save to session storage");
                    setStorageError(true);
                }
            };
            reader.readAsDataURL(file);
        } else {
            sessionStorage.removeItem("cvFile");
            setStorageError(false);
        }
    }, [file]);

    // Persist upload success flag
    useEffect(() => {
        sessionStorage.setItem("cvUploadSuccess", cvUploadSuccess.toString());
    }, [cvUploadSuccess]);

    // Handle successful CV upload
    const handleCVUploadSuccess = (uploadedFile, fileData) => {
        setUploadedFileData(fileData);
        try {
            sessionStorage.setItem("uploadedFileData", JSON.stringify(fileData));
        } catch (e) {
            console.warn("Could not save file metadata to session storage");
        }
        setCvUploadSuccess(true);
    };

    // Check if form is ready for generation
    const isFormComplete = file && jobDesc.trim().length >= 150 && cvUploadSuccess;

    return (
        <div className="page">
            <Navbar 
                actionButton={
                    <button 
                        className="btn primary" 
                        disabled={!isFormComplete}
                        title={
                            !file ? "Please upload your CV" :
                            !cvUploadSuccess ? "Your CV is being validated. Please wait." :
                            jobDesc.trim().length < 150 ? `Please enter at least 150 characters in the job description (${jobDesc.trim().length}/150)` :
                            "Generate tailored CV"
                        }
                    >
                        Generate CV
                    </button>
                } 
            />

            <main className="content">
                <div className="split">
                    <div className="upload-section">
                        <CVUpload 
                            file={file} 
                            setFile={setFile} 
                            storageError={storageError}
                            onUploadSuccess={handleCVUploadSuccess}
                        />
                        <CustomizePrompt />
                    </div>
                    <JobDescription jobDesc={jobDesc} setJobDesc={setJobDesc} />
                </div>
            </main>
            <Footer />
        </div>
    );
}