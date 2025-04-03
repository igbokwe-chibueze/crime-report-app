import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SafetReport - Anonymous Crime Reporting App",
  description: " Securely and anonymously report crime to law enforcement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <div className="relative min-h-screen bg-black selection:bg-sky-500">
          {/* gradient background */}
          <div className=" fixed insert-0 -z-10 min-h-screen">
            <div className=" absolute inset-0 h-full bg-[radial-gradient(circle_at_center, rgba(56,189,248,0.03), transparent_50%)]"/>
            <div className=" absolute inset-0 h-full bg-[radial-gradient(circle_at_center, rgba(14,165,233,0.05), transparent_70%)]"/>
          </div>
          {/* Todo: navbar */}

          <main className="pt-16">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
