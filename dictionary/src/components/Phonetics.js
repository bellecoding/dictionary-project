import React from "react";
import AudioButton from "./AudioButton";

export default function Phonetics({
  items = [],
  phoneticText = "",
  word = "",
}) {
  const firstText =
    phoneticText ||
    (Array.isArray(items) ? items.map((p) => p?.text).find(Boolean) : "") ||
    "";

  const firstAudio =
    (Array.isArray(items) ? items.map((p) => p?.audio).find(Boolean) : "") ||
    "";

  return (
    <>
      {firstText ? <span>/{firstText}/</span> : null}
      <AudioButton src={firstAudio} text={word} />
    </>
  );
}
