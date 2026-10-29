import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { bodyFont, displayFont } from '@/core/theme/fonts';
import { ThemeProvider, themeInitScript } from '@/core/theme/ThemeProvider';
import { AppProvider } from '@/core/auth/AppContext';
import { ToastProvider } from '@/core/ui';

export const metadata: Metadata = {
  title: 'DevCircle',
  description: 'Build in public with a small circle that keeps you shipping.',
};
export const viewport: Viewport = { themeColor: '#000000' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <head>
        {/* Sets the theme before first paint so the page never flashes the wrong colors. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            <AppProvider>{children}</AppProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
