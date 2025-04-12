// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SafetReport - Anonymous Crime Reporting App",
  description: "Securely and anonymously report crime to law enforcement.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          async
          defer
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        ></script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={null}>
          <div className="relative min-h-screen bg-black selection:bg-sky-500">
            <div className="fixed inset-0 -z-10 min-h-screen">
              <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03),transparent_50%)]" />
              <div className="absolute inset-0 h-full bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.05),transparent_70%)]" />
            </div>
            <Navbar />
            <main className="pt-16">{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
