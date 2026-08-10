import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Web App Utility Hub",
  description: "Un punto di accesso locale per le utility web React.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
