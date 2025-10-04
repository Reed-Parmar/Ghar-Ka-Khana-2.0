import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
// import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import SessionProvider from '@/components/SessionProvider';
import Navbar from '@/components/Navbar';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ghar Ka Khana - Homemade Food Delivery',
  description: 'Order delicious homemade food from local chefs in your area',
  keywords: ['food delivery', 'homemade food', 'local chefs', 'home cooking'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
              <Toaster />
            </div>
          </ThemeProvider>
        </SessionProvider>
        {/* <Analytics /> */}
      </body>
    </html>
  );
}
