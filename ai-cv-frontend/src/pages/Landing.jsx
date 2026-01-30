import "./landing.css";


export default function Landing() {
    return (
        <div className="page">
            <Navbar />
            <Hero />
            <Features />
            <Footer />
        </div>
    );
}


function Navbar() {
    return (
        <header className="navbar">
            <div className="nav-left">LOGO</div>

            <nav className="nav-right"> {/*Commented out as not sure if we need it. - Satwik. */}
                {/* <a href="#">Pricing</a>
                <a href="#">Templates</a>
                <a href="#">Log in</a>*/}
                <button className="btn primary">Get Started</button>
            </nav>
        </header>
    );
}



function Hero() {
    return (
        <section className="hero">

            <div className="announcement">
                <span className="announcement-text"><span className="emoji">✨</span> New: AI 2.0 Engine Released</span>
            </div>

            <h1 className="title-part1" style={{ color: '#333' }}>Get more interviews with
                <br />
                <span className="highlight" style={{ color: '#2563eb' }}>tailored CVs</span>
            </h1>
            <p className="subtitle">
                Our AI analyzes job descriptions to highlight your most relevant skills,
                keywords, and experiences in seconds. Stop wasting time on manual editing.
            </p>
            <div className="hero-actions">
                <button className="btn primary">Tailor My CV Now →</button>
                <button className="btn secondary">See Example</button>
            </div>
        </section>
    );
}


function Features() {
    return (
        <section className="features">
            <div className="feature-card">
                <div className="announcement"> <div className="emoji">⚡</div></div>
                <h3>AI-Powered</h3>
                <p>Advanced LLMs understand job nuances better than simple keyword matchers.</p>
            </div>
            <div className="feature-card">
                <div className="announcement"> <div className="emoji">⏱️</div></div>
                <h3>Save Hours</h3>
                <p>Generate a perfectly matched CV for every job application in under 30 seconds.</p>
            </div>
            <div className="feature-card">
                <div className="announcement"> <div className="emoji">❤️</div></div>
                <h3>ATS Friendly</h3>
                <p>Optimized formats that pass through Applicant Tracking Systems with ease.</p>
            </div>
        </section>
    );
}


function Footer() {
    return (
        <footer className="footer">
            <div>LOGO</div>
            <div className="footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
                <a href="#">Contact Us</a>
            </div>
            <div className="copyright">© 2026 NameEnterprise. All rights reserved.</div>
        </footer>
    );
}