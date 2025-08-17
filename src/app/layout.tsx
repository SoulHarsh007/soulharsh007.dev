import type {Metadata} from 'next';

import {Geist, Geist_Mono} from 'next/font/google';

import {ThemeProvider} from '@/components/theme-provider';

import './globals.css';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export const metadata: Metadata = {
  applicationName: 'SoulHarsh007: Domain Traffic Analysis',
  authors: [
    {
      name: 'SoulHarsh007',
      url: 'https://github.com/SoulHarsh007',
    },
  ],
  creator: 'SoulHarsh007',
  description: 'Domain traffic analysis for soulharsh007.dev.',
  keywords: ['soulharsh007', 'soulharsh007.dev'],
  metadataBase: new URL('https://soulharsh007.dev'),
  openGraph: {
    description: 'Domain traffic analysis for soulharsh007.dev.',
    emails: 'admin@soulharsh007.dev',
    locale: 'en_US',
    siteName: 'SoulHarsh007: Domain Traffic Analysis',
    title: 'SoulHarsh007: Domain Traffic Analysis',
    type: 'website',
    url: 'https://soulharsh007.dev',
  },
  robots: 'index, follow',
  title: 'SoulHarsh007: Domain Traffic Analysis',
  twitter: {
    card: 'summary_large_image',
    description: 'Domain traffic analysis for soulharsh007.dev.',
    title: 'SoulHarsh007: Domain Traffic Analysis',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
