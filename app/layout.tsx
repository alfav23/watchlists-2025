import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Mywatchlists App",
  description: "by Alyssa Favorito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
