import React from "react";
import AudioButton from "./AudioButton";

export default function Phonetics({
  items = [],
  phoneticText = "",
  word = "",
}) {
  // Try to find the first IPA text and audio URL if provided by the API
  const firstText =
    phoneticText ||
    (Array.isArray(items) ? items.map((p) => p?.text).find(Boolean) : "") ||
    "";

  const firstAudio =
    (Array.isArray(items) ? items.map((p) => p?.audio).find(Boolean) : "") ||
    "";

  return (
    <div>
      {firstText ? <span>/{firstText}/ </span> : null}
      {/* Always render a pronounce button: uses audio if present, else TTS */}
      <AudioButton src={firstAudio} text={word} />
    </div>
  );
}
