import { useState, useEffect } from "react";
import "./components.css";

export default function CustomizePrompt() {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState(() => sessionStorage.getItem("aiPrompt") || "");

  useEffect(() => {
    sessionStorage.setItem("aiPrompt", prompt);
  }, [prompt]);

  return (
    <div className="ai-prompt">
      <button
        className="ai-prompt-header"
        onClick={() => setOpen(!open)}
        type="button"
      >
        <div className="ai-prompt-left">
          <span className="ai-icon">✨</span>
          <div>
            <div className="ai-title">Customise AI Prompt</div>
            <div className="ai-subtitle">
              Adjust how AI tailors your CV
            </div>
          </div>
        </div>

        <span className={`ai-chevron ${open ? "open" : ""}`}>
          ˅
        </span>
      </button>

      <div className={`ai-accordion ${open ? "open" : ""}`}>
        <div className="ai-prompt-content">
          <textarea
            placeholder="E.g. Focus on leadership, quantify impact, optimize for ATS…"
            className="ai-textarea"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="ai-actions">
            <button
              type="button"
              className="btn-reset"
              onClick={() => setPrompt("")}
            >
              Reset to default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
