'use client';

import {useEffect, useRef, useState} from 'react';
import Stop from '@/components/Stop';

/**
 * Thirty minutes in three words.
 *
 * The section is three screens tall and its content is pinned: as the visitor
 * scrolls, Talk, Reflect and Act light up one after another over a very large
 * "30", and a point travels along the line beneath them. One idea, told by
 * scrolling instead of by reading.
 *
 * Until the script has measured anything (and with reduced motion, or without
 * JavaScript at all) every word is simply lit.
 */
export default function Scene({
  steps,
  unit,
  children,
}: {
  steps: Array<{word: string; text: string}>;
  unit: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      setProgress(p);
      setIndex(Math.min(steps.length - 1, Math.floor(p * steps.length)));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener('scroll', onScroll, {passive: true});
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [steps.length]);

  return (
    <section ref={ref} className={`scene t-navy${index === null ? '' : ' is-live'}`}>
      <div className="scene-pin">
        <p className="scene-num" aria-hidden="true">
          30
        </p>
        <div className="wrap scene-in">
          <p className="scene-unit">
            <span>30</span> {unit}
          </p>
          <ol className="scene-steps">
            {steps.map((step, i) => (
              <li key={step.word} className={index === null || i === index ? 'is-on' : undefined}>
                <h3>
                  <Stop>{step.word}</Stop>
                </h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <div className="scene-foot">
            <div className="scene-bar" aria-hidden="true">
              <i style={{left: `${progress * 100}%`}} />
            </div>
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
