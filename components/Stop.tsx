/**
 * The brand's one decorative device: the full stop.
 *
 * "L.E.B.E.N." and "Reden. Reflektieren. Handeln." are both built on it, so
 * every sentence-ending period in a headline is set in bronze. Periods inside
 * a word (as in L.E.B.E.N.) are left alone — only one followed by a space or
 * the end of the string counts.
 */
export default function Stop({children}: {children: string}) {
  const parts = children.split(/(\.)(?=\s|$)/);
  return (
    <>
      {parts.map((part, i) =>
        part === '.' ? (
          <span key={i} className="stop">
            .
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
