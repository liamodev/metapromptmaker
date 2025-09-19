import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Meta Prompt Maker - Built for Investment Teams",
  description: "Turn rough ideas into precise prompts—built for investment teams. Let AI ask you the right questions to create optimized, copy-ready prompts.",
  keywords: ["AI", "prompts", "investment", "finance", "meta-prompting", "GPT", "Claude", "Gemini"],
  authors: [{ name: "Altitude Global Advisors" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
