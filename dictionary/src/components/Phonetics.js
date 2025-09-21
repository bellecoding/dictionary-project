import React from "react";
import AudioButton from "./AudioButton";

export default function Phonetics({ items }) {
  // items: [{ text, audio }, ...]
  const valid = Array.isArray(items) ? items.filter(Boolean) : [];

  if (!valid.length) return null;

  return (
    <div aria-label="Pronunciation">
      {valid.map((p, i) => (
        <div key={i}>
          {p?.text ? <span>{p.text} </span> : null}
          {p?.audio ? <AudioButton src={p.audio} /> : null}
        </div>
      ))}
    </div>
  );
}
