import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";

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
    template: "%s - My Canvas",
    default: "My Canvas",
  },
  description: "My Canvas", //TODO: Add SEO description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col antialiased`}>
        <header className="bg-background flex items-center justify-center border-b p-1">
          <h1>My Canvas</h1>
        </header>
        <main className="flex flex-1 items-center justify-center overflow-auto">{children}</main>
        <footer className="flex items-center justify-center border-t p-1">
          <p>
            Created by{" "}
            <a href="https://jakubwojtysiak.online" target="_blank" rel="noopener noreferrer">
              jakubwojtysiak.online
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}
