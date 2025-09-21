import React from "react";
import Synonyms from "./Synonyms";

export default function Meaning({ group }) {
  const items = Array.isArray(group?.items) ? group.items : [];
  const syns = group?.synonyms instanceof Set ? Array.from(group.synonyms) : [];

  if (!items.length && !syns.length) return null;

  return (
    <article>
      {group?.partOfSpeech ? <h3>{group.partOfSpeech}</h3> : null}

      {items.length > 0 && (
        <ol>
          {items.map((d, i) => (
            <li key={i}>
              {d.definition}
              {d.example ? (
                <div>
                  <em>Example: “{d.example}”</em>
                </div>
              ) : null}
            </li>
          ))}
        </ol>
      )}

      {syns.length > 0 ? <Synonyms items={syns} /> : null}
      <hr />
    </article>
  );
}
