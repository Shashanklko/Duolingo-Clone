import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { I18nProvider } from "@/components/shared/I18nProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Duolingo Clone",
  description: "A fun language learning app clone.",
};

import { UserProvider } from "@/contexts/UserContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${nunito.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          <I18nProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
