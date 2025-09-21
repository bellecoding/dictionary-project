import React, { useState } from "react";
import "./App.css";
import SearchForm from "./SearchForm";
import Results from "./Results";

const API_KEY = "ddafb333ff3taa6005d55d473416odb3";
const API_BASE = "https://api.shecodes.io/dictionary/v1/define";

export default function App() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  async function handleSearch(word) {
    const q = String(word || "").trim();
    if (!q) return;

    setQuery(q);
    setLoading(true);
    setError("");
    setData(null);

    try {
      const url = `${API_BASE}?word=${encodeURIComponent(q)}&key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="Shell">
      <header className="site-header">
      <div className="container">
        <h1 className="brand">Dictionary</h1>
      </div>
    </header>
      <main className="container">
        <SearchForm defaultValue={query} onSearch={handleSearch} />

        {loading && (
          <div className="card">
            <p>Searching…</p>
          </div>
        )}
        {error && (
          <div className="card">
            <p>
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
        {data && <Results payload={data} />}
      </main>

      <footer className="site-footer">
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
