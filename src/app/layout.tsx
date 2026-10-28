import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CloudSdkInit } from "@/components/sitecore/cloud-sdk-init";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "My Recology Account",
    template: "%s · Recology",
  },
  description:
    "A demo of a modern Recology customer portal. Same AMCS accounts, invoices, and flows — a faster front end.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CloudSdkInit />
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
