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

export default function JobDescription() {
  const [text, setText] = useState("");
  const [keywords, setKeywords] = useState([]);

  function handleAnalyze() {
    const ks = extractKeywords(text || "");
    setKeywords(ks);
  }

  return (
    <section className="job-desc">
      <h2>Job Description</h2>
      <textarea
        className="job-textarea"
        placeholder="Paste a job description here or type a few lines..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={8}
      />
      <div className="job-actions">
        <button className="btn primary" onClick={handleAnalyze}>Analyze</button>
        <button className="btn secondary" onClick={() => { setText(""); setKeywords([]); }}>Clear</button>
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
