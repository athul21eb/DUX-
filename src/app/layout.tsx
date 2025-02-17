import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


import AllProviders from "@/components/layouts/allProviders";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default:"DUX",
    template:"%s | DUX "
  },// Set the tab title to "DUX | LOGIN"
  description: "DUX THE MENTORS APP",
  icons: {
    icon: "/dux.svg",
    shortcut: "/dux.svg",
    apple: "/dux.svg",
  },
};

export default  function RootLayout({
  children,modal
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {




  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased  `}
      >
        <AllProviders>{children}
        { modal} {/* Ensures the modal slot is rendered */}
        </AllProviders>
      </body>
    </html>
  );
}
