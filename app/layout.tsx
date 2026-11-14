/**
 * The document itself (<html>, <body>, fonts, stylesheet) lives in
 * app/[locale]/layout.tsx, where the language is known. Next still requires a
 * root layout, so this one only passes its children through.
 */
export default function RootLayout({children}: {children: React.ReactNode}) {
  return children;
}
