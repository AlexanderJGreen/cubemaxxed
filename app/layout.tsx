import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import AuthButton from "./components/AuthButton";
import { Analytics } from "@vercel/analytics/react";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-press-start",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cubemaxxed",
  description: "Learn to speedcube. Level up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} ${inter.variable} antialiased`}>
        <Header authButton={<AuthButton />} />
        <main>{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
