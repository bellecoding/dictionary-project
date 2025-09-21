import React, { useState } from "react";

export default function SearchForm({ defaultValue = "", onSearch }) {
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch && onSearch(value);
  }

  return (
    <section className="card search-card">
      <h2>What word do you want to look up?</h2>
      <form onSubmit={handleSubmit} className="search-row">
        <input
          type="text"
          placeholder='Try: "sunset", "eloquent", "serendipity"…'
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <button type="submit">Search</button>
      </form>
      <div className="search-hint">i.e. paris, wine, yoga, coding</div>
    </section>
  );
}
