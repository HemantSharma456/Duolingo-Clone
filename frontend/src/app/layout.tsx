import type { Metadata, Viewport } from 'next';
import './globals.css';
import { GameProvider } from '../context/GameContext';
import { SoundProvider } from '../context/SoundContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AppShell } from '../components/layout/AppShell';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#131f24',
};

export const metadata: Metadata = {
  title: 'Duolingo — The world’s best way to learn a language',
  description: 'Practice languages with fun, bite-sized lessons in an authentic Duolingo clone featuring 11 courses, 5 exercise types, streak tracking, hearts, and leaderboards.',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Duolingo',
  },
  formatDetection: {
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark" className="dark" style={{ colorScheme: 'dark' }}>
      <body className="antialiased min-h-screen bg-[var(--bg-main)] text-[var(--text-primary)]">
        <ThemeProvider>
          <SoundProvider>
            <GameProvider>
              <AppShell>
                {children}
              </AppShell>
            </GameProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
