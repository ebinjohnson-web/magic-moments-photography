import './globals.css';

export const metadata = {
  metadataBase: new URL('https://mmphotographi.ca'),
  title: 'Magic Moments — Photography & Film',
  description: 'Honest emotion. Artful storytelling. Wedding, couple, family and portrait photography by Antony, Albi and Mithun.',
  alternates: { canonical: '/' },
  openGraph: { title: 'Magic Moments — Photography & Film', description: 'For the moments that become everything.', url: '/', type: 'website', images: ['/assets/portfolio/weddings/IMG_1051.webp'] }
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
