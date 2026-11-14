'use client';

import {useEffect, useRef, useState} from 'react';

export type StageLine = {phase: string; text: string};

/**
 * Lisa, alive: a short clip of the avatar speaking, in a circle with the
 * coral sun rising behind it. Beside her, what she is asking right now — the
 * line changes every few seconds and moves through Talk, Reflect, Act.
 *
 * The clip is /public/lisa.mp4 with /public/lisa.jpg as its first frame;
 * replace those two files to change who plays Lisa. With reduced motion the
 * clip stays on its still frame and the line stops on the last question.
 */
export default function LisaStage({
  lines,
  labels,
}: {
  lines: StageLine[];
  labels: {alt: string; listening: string; says: string};
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.current?.pause();
      setIndex(lines.length - 1);
      return;
    }
    const id = window.setInterval(() => setIndex(i => (i + 1) % lines.length), 4200);
    return () => window.clearInterval(id);
  }, [lines.length]);

  return (
    <div className="stage-mid">
      <div className="orb">
        <span className="orb-sun" aria-hidden="true" />
        <div className="orb-face">
          <video
            ref={video}
            src="/lisa.mp4"
            poster="/lisa.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={labels.alt}
          />
        </div>
        <span className="orb-live">
          <i aria-hidden="true" />
          {labels.listening}
        </span>
      </div>

      <div className="say">
        <p className="say-who">{labels.says}</p>
        <p className="say-text" key={index}>
          <q>{lines[index].text}</q>
        </p>
        <ol className="say-phases" aria-hidden="true">
          {lines.map((line, i) => (
            <li key={line.phase} className={i === index ? 'is-on' : undefined}>
              {line.phase}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
