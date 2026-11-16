/**
 * The li-fe.ai wordmark: italic white letters, ".ai" in gold, and a gold arc
 * sweeping over the name. `big` is the hero version.
 */
export default function Logo({big = false}: {prefix?: string; big?: boolean}) {
  return (
    <span className={`logo${big ? ' logo--big' : ''}`}>
      <svg className="logo-arc" viewBox="0 0 120 22" aria-hidden="true" preserveAspectRatio="none">
        <path d="M3 20 C 28 2, 78 -2, 117 9" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
      <span className="logo-word" role="img" aria-label="li-fe.ai">
        <span aria-hidden="true">li-fe</span>
        <b aria-hidden="true">.ai</b>
      </span>
    </span>
  );
}
