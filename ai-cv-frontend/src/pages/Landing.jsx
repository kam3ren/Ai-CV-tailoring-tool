import "./landing.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
//import CVUpload from "../components/CVUpload";
//import JobDescription from "../components/JobDescription";


export default function Landing() {
    return (
        <div className="page">
            <Navbar />
            <Hero />
                <Features />

                <main className="content">
                    {/* <div className="split">
                        <CVUpload />
                        <JobDescription />
                    </div> */}
                </main>
            <Footer />
        </div>
    );
}

//NEED TO MAKE CHANGES HERE TO THE TITLE
function Hero() {
    return (
        <section className="hero">

            <div className="announcement">
                <span className="announcement-text"><span className="emoji">✨</span> AI-Powered CV Optimization</span>
            </div>

            <h1 className="highlight">Tailor Your CV
                <br />
                <span className="title-part1">To A Specific Job</span>
            </h1>
            <p className="subtitle">
                Upload your CV, paste the job description, and generate a tailored CV in seconds.
            </p>
            <div className="hero-actions">
                <button className="btn primary">Tailor My CV Now →</button>
            </div>
        </section>
    );
}


function Features() {
    return (
        <section className="features">
            <h1 className="sub-heading">Steps To Get Closer To Your Next Job</h1>
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">⬆️</div>
                    <span className="feature-step">Step 1</span>
                    <h3>Upload Your CV</h3>
                    <p>
                        Upload your existing CV in PDF or DOCX format. Our system extracts and understands your experience.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">📄</div>
                    <span className="feature-step">Step 2</span>
                    <h3>Paste Job Description</h3>
                    <p>
                        Simply copy and paste the job description here. Include the full job posting with responsibilities
                        and requirements.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">✨</div>
                    <span className="feature-step">Step 3</span>
                    <h3>AI Tailoring</h3>
                    <p>
                        Our AI rewrites your CV to highlight relevant skills and match ATS requirements for the role.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon">⬇️</div>
                    <span className="feature-step">Step 4</span>
                    <h3>Download & Apply</h3>
                    <p>
                        Preview your tailored CV and download it as a polished PDF ready for your application.
                    </p>
                </div>
            </div>
        </section>
    );
}
