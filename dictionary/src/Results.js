import React, { useMemo } from "react";
import Phonetics from "./components/Phonetics";
import Meaning from "./components/Meaning";

export default function Results({ payload }) {
  const word = payload?.word || payload?.term || "";
  const phoneticText = payload?.phonetic || "";
  const phoneticsArr = Array.isArray(payload?.phonetics)
    ? payload.phonetics
    : [];
  const sources = Array.isArray(payload?.sourceUrls) ? payload.sourceUrls : [];

  // Normalize & group meanings by part of speech
  const groups = useMemo(() => {
    const arr = Array.isArray(payload?.meanings) ? payload.meanings : [];
    const byPOS = new Map();

    arr.forEach((m) => {
      const pos = m?.partOfSpeech || "other";
      const group = byPOS.get(pos) || {
        partOfSpeech: pos,
        items: [],
        synonyms: new Set(),
      };

      // Shape A: { definitions: [{ definition, example, synonyms }] }
      if (Array.isArray(m?.definitions)) {
        m.definitions.forEach((d) => {
          if (d?.definition) {
            group.items.push({
              definition: d.definition,
              example: d.example || "",
            });
            if (Array.isArray(d?.synonyms))
              d.synonyms.forEach((s) => group.synonyms.add(s));
          }
        });
      }

      // Shape B: { definition, example, synonyms }
      if (m?.definition) {
        group.items.push({
          definition: m.definition,
          example: m.example || "",
        });
      }
      if (Array.isArray(m?.synonyms))
        m.synonyms.forEach((s) => group.synonyms.add(s));

      byPOS.set(pos, group);
    });

    return Array.from(byPOS.values());
  }, [payload]);

  if (!word) return null;

  return (
    <section aria-label="Dictionary results">
      <header>
        <h2>{word}</h2>
        {phoneticText ? <p>/{phoneticText}/</p> : null}
        {phoneticsArr.length > 0 ? <Phonetics items={phoneticsArr} /> : null}
      </header>

      {groups.map((g, i) => (
        <Meaning key={i} group={g} />
      ))}

      {sources.length > 0 && (
        <footer>
          <p>Source{sources.length > 1 ? "s" : ""}:</p>
          <ul>
            {sources.map((u, i) => (
              <li key={i}>
                <a href={u} target="_blank" rel="noreferrer">
                  {u}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </section>
  );
}
