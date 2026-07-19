import type { Metadata } from "next";

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
  return children;
}
