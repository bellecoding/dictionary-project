import React, { useState } from "react";

export default function SearchForm({ defaultValue = "", onSearch }) {
  const [value, setValue] = useState(defaultValue);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch && onSearch(value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder='Type a word (e.g., "sunset")…'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus
      />
      <button type="submit">Search</button>
    </form>
  );
}
