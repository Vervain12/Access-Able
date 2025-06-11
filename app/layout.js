import { Geist, Geist_Mono, Inter, Outfit, JetBrains_Mono } from 'next/font/google';
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Navigation } from "@/website/navigation"
import { Footer } from "@/website/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Add your website fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata = {
  title: "Access Able - Discover Accessible Places",
  description: "Find restaurants, parks, hotels, and more that are accessible to everyone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${outfit.variable} ${jetbrainsMono.variable} antialiased font-inter`}
      >
        <AppRouterCacheProvider>
          <Navigation />
          {children}
          <Footer />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}