import React, { useEffect, useState } from "react";

const PEXELS_KEY = "NqTKcPisEfjjLJovrzYtEMupm28EJDj4XwP3IyQNAvY06pQDGrPRAjOd";

export default function Gallery({ query }) {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const q = String(query || "").trim();
    if (!q) return;

    const ctrl = new AbortController();
    async function run() {
      setLoading(true);
      setErr("");
      setPhotos([]);
      try {
        const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          q
        )}&per_page=9&orientation=landscape`;
        const res = await fetch(url, {
          signal: ctrl.signal,
          headers: { Authorization: PEXELS_KEY },
        });
        if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
        const json = await res.json();
        setPhotos(Array.isArray(json.photos) ? json.photos : []);
      } catch (e) {
        if (e.name !== "AbortError") setErr(String(e.message || e));
      } finally {
        setLoading(false);
      }
    }
    run();
    return () => ctrl.abort();
  }, [query]);

  if (!query) return null;

  return (
    <section className="card gallery-card" aria-label="Related photos">
      <div className="gallery-header">
        <h3>Images</h3>
        <span className="gallery-sub">Powered by Pexels</span>
      </div>

      {loading && <p>Loading images…</p>}
      {err && (
        <p>
          <strong>Could not load images:</strong> {err}
        </p>
      )}

      {!loading && !err && photos.length > 0 && (
        <div className="gallery-grid">
          {photos.map((p) => {
            const src =
              p?.src?.landscape ||
              p?.src?.large ||
              p?.src?.large2x ||
              p?.src?.medium;
            return (
              <a
                key={p.id}
                className="photo-link"
                href={p.url}
                target="_blank"
                rel="noreferrer"
                title={`Photo by ${p?.photographer || "Pexels"}`}
              >
                <img
                  className="gallery-photo"
                  src={src}
                  alt={p?.alt || query}
                  loading="lazy"
                />
              </a>
            );
          })}
        </div>
      )}
    </section>
  );
}
