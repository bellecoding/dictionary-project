import React, { useState } from "react";
import SearchForm from "./SearchForm";
import Results from "./Results";

const API_KEY = "ddafb333ff3taa6005d55d473416odb3";
const API_BASE = "https://api.shecodes.io/dictionary/v1/define";

export default function App() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function handleSearch(word) {
    const q = String(word || "").trim();
    if (!q) return;

    setQuery(q);
    setSubmitted(q);
    setLoading(true);
    setError("");
    setData(null);

    try {
      const url = `${API_BASE}?word=${encodeURIComponent(q)}&key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        let msg = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          msg = j?.message || j?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="App">
      <h1>Dictionary</h1>

      <SearchForm
        defaultValue={query}
        onSearch={(word) => handleSearch(word)}
      />

      {loading && <p>Loading…</p>}
      {error && (
        <p>
          Error: <strong>{error}</strong>
        </p>
      )}
      {!loading && !error && submitted && !data && (
        <p>
          No data yet for: <strong>{submitted}</strong>
        </p>
      )}
      {data && <Results payload={data} />}

      <footer>
        <small>
          This project was coded by <strong>Belle Coding</strong> and is{" "}
          <a
            href="https://github.com/bellecoding/dictionary-project"
            target="_blank"
            rel="noreferrer"
          >
            open-sourced on GitHub
          </a>{" "}
          and{" "}
          <a
            href="https://dictionaryprojectreact.netlify.app/"
            target="_blank"
            rel="noreferrer"
          >
            hosted on Netlify
          </a>
          .
        </small>
      </footer>
    </div>
  );
}
