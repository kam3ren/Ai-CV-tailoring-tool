import React, { useState } from "react";
import "./components.css";

const STOPWORDS = new Set([
  "the","and","a","to","of","in","for","on","with","is","are","that","as","at","you","your","by","we","be","or","it"
]);

function extractKeywords(text, limit = 8) {
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const counts = {};
  for (const w of cleaned.split(" ")) {
    if (!w || STOPWORDS.has(w) || w.length < 3) continue;
    counts[w] = (counts[w] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map((t) => t[0]);
}

export default function JobDescription({ jobDesc, setJobDesc }) {
  const [keywords, setKeywords] = useState([]);

  function handleAnalyze() {
    const ks = extractKeywords(jobDesc || "");
    setKeywords(ks);
  }

  return (
    <section className="job-desc">
      <h2>Job Description</h2>
      <textarea
        className="job-textarea"
        placeholder="Enter the job description you want to tailor your CV for."
        value={jobDesc}
        onChange={(e) => setJobDesc(e.target.value)}
        rows={8}
      />
      <div
        className="char-count"
        style={{ color: (jobDesc?.length || 0) < 150 ? "#ef4444" : undefined }}
      >
        {jobDesc?.length || 0} characters
      </div>
      <div className="job-actions">
        <button className="btn primary" onClick={handleAnalyze} disabled={!jobDesc || jobDesc.length < 150}>Analyze</button>
        <button className="btn secondary" onClick={() => { setJobDesc(""); setKeywords([]); }}>Clear</button>
      </div>

      {keywords.length > 0 && (
        <div className="keywords">
          <h4>Extracted keywords</h4>
          <div className="kw-list">{keywords.map((k) => <span key={k} className="kw">{k}</span>)}</div>
        </div>
        
      )}
    </section>
  );
}
