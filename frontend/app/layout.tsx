import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CoFoundersHub — Find Your Perfect Co-Founder",
  description:
    "AI-powered co-founder matching platform. Connect with the right technical or business partner, communicate in real-time, and build your startup together.",
  keywords: ["co-founder", "startup", "matching", "entrepreneur", "founder"],
  openGraph: {
    title: "CoFoundersHub — Find Your Perfect Co-Founder",
    description:
      "AI-powered co-founder matching. Connect, chat, and build together.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="min-h-screen bg-background font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
