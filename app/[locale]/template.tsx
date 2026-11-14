/**
 * A template is re-mounted on every navigation (a layout is not), which is
 * what lets each page arrive with a short fade instead of snapping in. The
 * header and footer live in the layout and stay perfectly still meanwhile.
 */
export default function Template({children}: {children: React.ReactNode}) {
  return <div className="page">{children}</div>;
}
