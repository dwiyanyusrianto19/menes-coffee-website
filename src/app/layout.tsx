import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menes Coffee & Eatery - BeMore | Padang",
  description:
    "Menes Coffee & Eatery - Tempat nongkrong terbaik di Padang. Nikmati kopi premium, makanan lezat, dan suasana cozy di Jl. Kartini No. 24, Padang. Buka setiap hari 09:00 - 03:00.",
  keywords: [
    "Menes Coffee",
    "Cafe Padang",
    "Kopi Padang",
    "Coffee Shop Padang",
    "Eatery Padang",
    "Tempat Nongkrong Padang",
    "Cafe Minang",
  ],
  authors: [{ name: "Menes Coffee & Eatery" }],
  openGraph: {
    title: "Menes Coffee & Eatery - BeMore",
    description: "Tempat nongkrong terbaik di Padang. Kopi premium, makanan lezat, suasana cozy.",
    url: "https://menescoffee.com",
    siteName: "Menes Coffee & Eatery",
    type: "website",
    images: [{
      url: "/cafe-images/hero.png",
      width: 1344,
      height: 768,
      alt: "Menes Coffee & Eatery Interior",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Menes Coffee & Eatery",
    description: "BeMore - Tempat nongkrong terbaik di Padang",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${dmSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
