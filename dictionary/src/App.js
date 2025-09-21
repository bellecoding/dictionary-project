import React, { useState } from "react";

const API_KEY = "ddafb333ff3taa6005d55d473416odb3";
const API_BASE = "https://api.shecodes.io/dictionary/v1/define";

export default function App() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);
  const [definitions, setDefinitions] = useState([]);

  async function handleSubmit(e) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSubmitted(q);
    setLoading(true);
    setError("");
    setPayload(null);
    setDefinitions([]);

    try {
      const url = `${API_BASE}?word=${encodeURIComponent(q)}&key=${API_KEY}`;
      const res = await fetch(url);
      if (!res.ok) {
        // Try to read error body, fall back to status text
        let msg = `${res.status} ${res.statusText}`;
        try {
          const j = await res.json();
          msg = j?.message || j?.error || msg;
        } catch {}
        throw new Error(msg);
      }
      const data = await res.json();
      setPayload(data);
      setDefinitions(extractDefinitions(data));
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // Tries a few common shapes without assuming one exact schema
  function extractDefinitions(data) {
    const defs = [];

    if (!data) return defs;

    // SheCodes often returns { word, phonetics?, meanings: [{ partOfSpeech, definitions: [{ definition, example }] }] }
    if (Array.isArray(data.meanings)) {
      data.meanings.forEach((m) => {
        const pos = m?.partOfSpeech || "";
        if (Array.isArray(m.definitions)) {
          m.definitions.forEach((d) => {
            if (d?.definition) {
              defs.push({
                definition: d.definition,
                example: d.example || "",
                partOfSpeech: pos,
              });
            }
          });
        } else if (m?.definition) {
          defs.push({
            definition: m.definition,
            example: m.example || "",
            partOfSpeech: pos,
          });
        }
      });
    }

    // Fallbacks for other shapes
    if (Array.isArray(data.definitions)) {
      data.definitions.forEach((d) => {
        if (typeof d === "string") {
          defs.push({ definition: d, example: "", partOfSpeech: "" });
        } else if (d && typeof d === "object") {
          defs.push({
            definition: d.definition || "",
            example: d.example || "",
            partOfSpeech: d.partOfSpeech || "",
          });
        }
      });
    }
    if (!defs.length && typeof data.definition === "string") {
      defs.push({
        definition: data.definition,
        example: data.example || "",
        partOfSpeech: data.partOfSpeech || "",
      });
    }

    return defs;
  }

  return (
    <div className="App">
      <h1>Dictionary</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="q"
          placeholder='Type a word (e.g., "sunset")…'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </form>

      {submitted && !loading && !error && definitions.length === 0 && (
        <p>
          No definitions found for: <strong>{submitted}</strong>
        </p>
      )}

      {error && (
        <p>
          Error: <strong>{error}</strong>
        </p>
      )}

      {definitions.length > 0 && (
        <section>
          <h2>Results for: {submitted}</h2>
          <ol>
            {definitions.map((d, i) => (
              <li key={i}>
                {d.partOfSpeech ? <em>{d.partOfSpeech}</em> : null}{" "}
                {d.definition}
                {d.example ? <div>Example: “{d.example}”</div> : null}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Raw JSON helps debugging while we finalize the renderer */}
      {payload ? (
        <details>
          <summary>Raw API response</summary>
          <pre>{JSON.stringify(payload, null, 2)}</pre>
        </details>
      ) : null}

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
