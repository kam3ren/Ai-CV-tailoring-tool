import { useState, useEffect } from "react";
import "./Landing.css";
import "./Upload.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CVUpload from "../components/CVUpload";
import JobDescription from "../components/JobDescription";
import CustomizePrompt from "../components/AIprompt";

export default function Upload() {
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

    const [storageError, setStorageError] = useState(false);

    const [jobDesc, setJobDesc] = useState(() => {
        return sessionStorage.getItem("jobDesc") || "";
    });

    useEffect(() => {
        sessionStorage.setItem("jobDesc", jobDesc);
    }, [jobDesc]);

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

    return (
    <div className="page">
                <Navbar actionButton={<button className="btn primary" disabled={!file || !jobDesc.trim()}>Generate CV</button>} />
    
                    <main className="content">
                        <div className="split">
                            <div className="upload-section">
                                <CVUpload file={file} setFile={setFile} storageError={storageError} />
                                <CustomizePrompt />
                            </div>
                            <JobDescription jobDesc={jobDesc} setJobDesc={setJobDesc} />
                        </div>
                    </main>
                <Footer />
            </div>
    );
}