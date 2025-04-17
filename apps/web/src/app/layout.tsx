import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from '@/components/AuthProvider';
import { ToastContainer } from 'react-toastify';
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Co-Lab - Real-time Collaboration Platform',
  description: 'Collaborate in real-time with code, video, music, and more',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
        <ToastContainer style={{zIndex:"999999"}}/>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}