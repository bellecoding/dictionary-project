import React, { useRef, useState } from "react";

export default function AudioButton({ src }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      a.currentTime = 0;
      setPlaying(false);
    } else {
      a.play()
        .then(() => setPlaying(true))
        .catch(() => {});
    }
  }

  return (
    <>
      <button type="button" onClick={toggle}>
        {playing ? "Stop" : "Play"}
      </button>
      <audio ref={audioRef} src={src} onEnded={() => setPlaying(false)} />
    </>
  );
}
