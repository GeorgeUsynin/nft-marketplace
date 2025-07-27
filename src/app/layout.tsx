import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Header, Separator, Toaster } from '@/components/ui';
import { WalletStoreProvider } from '@/stores/wallet-store-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

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
          enableSystem
          disableTransitionOnChange
        >
          <WalletStoreProvider>
            <div className="mx-auto w-full max-w-screen-xl px-4">
              <Header />
              <Separator />
              {children}
            </div>
            <Toaster />
          </WalletStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
