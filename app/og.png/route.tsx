import {ImageResponse} from 'next/og';

/* The 1200×630 share card, served at /og.png. The dotted path keeps the
   next-intl middleware away from it. One static card, rendered once. */
export const runtime = 'nodejs';
export const revalidate = false;

const BRAND = '#CFE6F4';
const ACCENT = '#FF6B57';
const ON = '#12305A';

export async function GET() {
  const word = (text: string) => (
    <div style={{display: 'flex'}}>
      {text}
      <span style={{color: ACCENT}}>.</span>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          background: BRAND,
          color: ON,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{display: 'flex', fontSize: 30, fontWeight: 700, letterSpacing: '0.16em'}}>
          PROJEKT L<span style={{color: ACCENT}}>.</span>E<span style={{color: ACCENT}}>.</span>B
          <span style={{color: ACCENT}}>.</span>E<span style={{color: ACCENT}}>.</span>N
          <span style={{color: ACCENT}}>.</span>
        </div>

        <div style={{display: 'flex', flexDirection: 'column', fontSize: 124, fontWeight: 700, lineHeight: 0.98, letterSpacing: '-0.04em'}}>
          {word('Reden')}
          {word('Reflektieren')}
          {word('Handeln')}
        </div>

        <div style={{display: 'flex', fontSize: 32, color: '#35506F'}}>
          Dreißig Minuten für Ihre Situation. Ein konkreter nächster Schritt.
        </div>
      </div>
    ),
    {width: 1200, height: 630},
  );
}
