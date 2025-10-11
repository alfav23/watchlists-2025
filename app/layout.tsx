import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mywatchlists App",
  description: "by Alyssa Favorito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
