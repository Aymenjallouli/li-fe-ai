'use client';

import {useState} from 'react';

export type AskTopic = {title: string; start: string; ask: string; step: string};

/**
 * "What's on your mind?" — the visitor picks a topic and Lisa answers the way
 * she would in a conversation: with a question, and then a possible next
 * step. It shows the method by letting people try it, in two clicks.
 *
 * On a wide screen her reply sits beside the list; on a narrow one it opens
 * under the chosen topic.
 */
export default function Ask({
  topics,
  labels,
}: {
  topics: AskTopic[];
  labels: {reply: string; step: string; alt: string};
}) {
  const [active, setActive] = useState(0);
  const topic = topics[active];

  const reply = (t: AskTopic) => (
    <>
      <div className="reply-head">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/lisa.jpg" alt={labels.alt} width={64} height={64} />
        <span>{labels.reply}</span>
      </div>
      <p className="reply-q">
        <q>{t.ask}</q>
      </p>
      <div className="reply-step">
        <span>{labels.step}</span>
        <p>{t.step}</p>
      </div>
    </>
  );

  return (
    <div className="ask">
      <ul className="ask-list">
        {topics.map((t, i) => (
          <li key={t.title} className={i === active ? 'is-on' : undefined}>
            <button
              type="button"
              aria-pressed={i === active}
              onClick={() => setActive(i)}
              onPointerEnter={e => e.pointerType === 'mouse' && setActive(i)}
            >
              <i aria-hidden="true" />
              {t.title}
            </button>
            {i === active ? <div className="reply reply--inline">{reply(t)}</div> : null}
          </li>
        ))}
      </ul>

      <div className="reply reply--side" aria-live="polite" key={active}>
        {reply(topic)}
      </div>
    </div>
  );
}
