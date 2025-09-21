import React from "react";

export default function Meaning({ group }) {
  const items = Array.isArray(group?.items) ? group.items : [];
  const syns = group?.synonyms instanceof Set ? Array.from(group.synonyms) : [];

  if (!items.length && !syns.length) return null;

  return (
    <>
      {group?.partOfSpeech ? <h3>{group.partOfSpeech}</h3> : null}
      {items.length > 0 && (
        <ol>
          {items.map((d, i) => (
            <li key={i}>
              {d.definition}
              {d.example ? (
                <div className="example">Example: “{d.example}”</div>
              ) : null}
            </li>
          ))}
        </ol>
      )}

      {syns.length > 0 ? (
        <div className="synonyms">
          <strong>Similar:</strong>
          {syns.map((s, i) => (
            <span className="chip" key={i}>
              {s}
            </span>
          ))}
        </div>
      ) : null}
      <hr />
    </>
  );
}
