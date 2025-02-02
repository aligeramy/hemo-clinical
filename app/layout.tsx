import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getServerSession } from "next-auth";
import { SessionProvider } from "@/components/session-provider";
import { Header } from "@/components/header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Medical Imaging Archive",
  description: "A secure platform for accessing and managing medical imaging studies and patient data",
  keywords: [
    "medical imaging",
    "radiology",
    "PACS",
    "patient records",
    "healthcare",
    "medical studies"
  ],
  authors: [
    {
      name: "Hospital Radiology Department",
    }
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProvider session={session}>
          {session && <Header />}
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
