import type { Metadata } from 'next';
import './globals.css';
import { GameProvider } from '../context/GameContext';
import { SoundProvider } from '../context/SoundContext';
import { ThemeProvider } from '../context/ThemeContext';
import { AppShell } from '../components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Duolingo — The world’s best way to learn a language',
  description: 'Practice languages with fun, bite-sized lessons in an authentic Duolingo clone featuring 8 courses, 5 exercise types, streak tracking, hearts, and leaderboards.',
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
