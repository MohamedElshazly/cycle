import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { QueryProvider } from "@/components/QueryProvider";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Cycle",
  description: "Understand why you keep stopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} dark h-full`}>
      <body className="min-h-full">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
