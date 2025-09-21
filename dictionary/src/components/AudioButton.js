import React, { useRef, useState } from "react";

export default function AudioButton({ src = "", text = "" }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function play() {
    if (src && audioRef.current) {
      const a = audioRef.current;
      a.currentTime = 0;
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window && text) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      utter.rate = 1;
      utter.onend = () => setPlaying(false);
      try {
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utter);
        setPlaying(true);
      } catch {}
    }
  }

  function stop() {
    if (src && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  }

  return (
    <>
      <button
        type="button"
        className="audio-btn"
        onClick={playing ? stop : play}
        aria-label={playing ? "Stop pronunciation" : "Play pronunciation"}
        title={playing ? "Stop" : "Play"}
      >
        <span className="audio-icon">🔊</span> {playing ? "Stop" : "Play"}
      </button>
      {src ? (
        <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
      ) : null}
    </>
  );
}
