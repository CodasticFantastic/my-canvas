import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/shadcn/theme-provider";
import { Toaster } from "@/components/shadcn/ui/sonner";

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
    default: "Canvas Editor - My Canvas",
  },
  description: "Canvas Editor", //TODO: Add SEO description
};

export default function CanvasEditorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main>{children}</main>
          <Toaster position="top-center" richColors duration={2000} closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
