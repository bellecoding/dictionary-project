import React from "react";

export default function Synonyms({ items }) {
  const list = Array.isArray(items) ? items.filter(Boolean) : [];
  if (!list.length) return null;

  return (
    <div>
      <strong>Synonyms:</strong>{" "}
      {list.map((s, i) => (
        <span key={i}>
          {s}
          {i < list.length - 1 ? ", " : ""}
        </span>
      ))}
    </div>
  );
}
