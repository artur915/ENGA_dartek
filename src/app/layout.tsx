import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ENGA — Engineering Services Marketplace",
  description:
    "Connect with licensed engineering offices in Saudi Arabia. Submit requests, compare quotations, and track project execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
