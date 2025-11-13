import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/shadcn/theme-provider";
import { ThemeSwitcher } from "@/components/shadcn/theme-switcher";

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} flex h-screen flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <header className="bg-background border-b p-2">
            <div className="container mx-auto flex items-center justify-between">
              <h1>My Canvas</h1>

              <ThemeSwitcher />
            </div>
          </header>
          <main className="container mx-auto flex flex-1 items-center justify-center overflow-auto">{children}</main>
          <footer className="flex border-t p-1">
            <div className="container mx-auto flex items-center justify-center">
              <p>
                Created by{" "}
                <a href="https://jakubwojtysiak.online" target="_blank" rel="noopener noreferrer">
                  jakubwojtysiak.online
                </a>
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
