/**
 * Sets every sentence-ending period in a headline in the accent colour.
 * Periods inside a word (as in "li-fe.ai") are left alone — only one followed
 * by a space or the end of the string counts.
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
