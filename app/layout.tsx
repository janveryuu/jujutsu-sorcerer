import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Rajdhani, Geist_Mono, Cinzel } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  variable: '--font-space-grotesk', // keep same CSS var so all existing font-heading classes work
  subsets: ['latin'],
  weight: '400',
})
const rajdhani = Rajdhani({
  variable: '--font-inter',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const cinzel = Cinzel({
  variable: '--font-cinzel',
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
})
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'JUJUTSU — Awaken Your Cursed Energy',
  description:
    'A gamified fitness companion that turns real workouts into exorcism missions. Gain cursed energy, rise through the grades, and unlock domain techniques.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  openGraph: {
    title: 'JUJUTSU — Awaken Your Cursed Energy',
    description: 'A gamified fitness companion that turns real workouts into exorcism missions.',
    url: 'https://jujutsu-fitness.vercel.app',
    siteName: 'JUJUTSU Fitness',
    images: [
      {
        url: '/jujutsu-hero-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'JUJUTSU Fitness Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JUJUTSU — Awaken Your Cursed Energy',
    description: 'A gamified fitness companion that turns real workouts into exorcism missions.',
    images: ['/jujutsu-hero-bg.jpg'],
  },
  appleWebApp: {
    title: 'JUJUTSU',
    statusBarStyle: 'black-translucent',
    capable: true,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#090d12',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${bebasNeue.variable} ${rajdhani.variable} ${geistMono.variable} ${cinzel.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
