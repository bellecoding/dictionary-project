import React, { useMemo } from "react";
import Phonetics from "./components/Phonetics";
import Meaning from "./components/Meaning";
import Gallery from "./components/Gallery"; // <-- add this

export default function Results({ payload }) {
  const word = payload?.word || payload?.term || "";
  const phoneticText = payload?.phonetic || "";
  const phoneticsArr = Array.isArray(payload?.phonetics)
    ? payload.phonetics
    : [];

  const groups = useMemo(() => {
    const arr = Array.isArray(payload?.meanings) ? payload.meanings : [];
    const byPOS = new Map();
    arr.forEach((m) => {
      const pos = m?.partOfSpeech || "other";
      const g = byPOS.get(pos) || {
        partOfSpeech: pos,
        items: [],
        synonyms: new Set(),
      };
      if (Array.isArray(m?.definitions)) {
        m.definitions.forEach((d) => {
          if (d?.definition) {
            g.items.push({
              definition: d.definition,
              example: d.example || "",
            });
            if (Array.isArray(d?.synonyms))
              d.synonyms.forEach((s) => g.synonyms.add(s));
          }
        });
      }
      if (m?.definition) {
        g.items.push({ definition: m.definition, example: m.example || "" });
      }
      if (Array.isArray(m?.synonyms))
        m.synonyms.forEach((s) => g.synonyms.add(s));
      byPOS.set(pos, g);
    });
    return Array.from(byPOS.values());
  }, [payload]);

  if (!word) return null;

  return (
    <>
      <section className="card headword-card">
        <h2>{word}</h2>
        <div className="phonetics">
          {phoneticText ? <span>/{phoneticText}/</span> : null}
          <Phonetics
            word={word}
            phoneticText={phoneticText}
            items={phoneticsArr}
          />
        </div>
      </section>

      {groups.map((g, i) => (
        <section key={i} className="card pos-card">
          <Meaning group={g} />
        </section>
      ))}

      {/* NEW: image gallery */}
      <Gallery query={word} />
    </>
  );
}
