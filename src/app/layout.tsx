import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sourcegraph Hiring Trivia",
  description: "Test your hiring knowledge across 5 rounds of Sourcegraph-themed trivia questions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/PolySansGX.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/PolySansItalicGX.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
