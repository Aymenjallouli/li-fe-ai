'use client';

import {useEffect, useRef, useState} from 'react';
import type {ReactNode} from 'react';

/**
 * Fade-and-rise on first scroll into view.
 *
 * React owns the class, so server and client render the same markup and the
 * element only becomes `rv in` through an ordinary state update. Without
 * JavaScript the content is simply visible: the hidden start state is scoped
 * to `.js`, set before first paint in app/[locale]/layout.tsx.
 *
 * All instances share one IntersectionObserver.
 */
type Cb = () => void;

let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Cb>();

function observe(el: Element, cb: Cb) {
  if (!observer) {
    observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          callbacks.get(entry.target)?.();
          callbacks.delete(entry.target);
          observer!.unobserve(entry.target);
        }
      },
      {threshold: 0.1, rootMargin: '0px 0px -6% 0px'},
    );
  }
  callbacks.set(el, cb);
  observer.observe(el);
  return () => {
    callbacks.delete(el);
    observer?.unobserve(el);
  };
}

export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  id,
}: {
  children: ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'ol' | 'ul' | 'figure' | 'p';
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    return observe(el, () => setShown(true));
  }, []);

  const classes = ['rv', shown ? 'in' : '', className].filter(Boolean).join(' ');
  const style = delay ? ({['--d' as string]: `${delay}ms`} as React.CSSProperties) : undefined;

  return (
    <Tag ref={ref as never} id={id} className={classes} style={style}>
      {children}
    </Tag>
  );
}
