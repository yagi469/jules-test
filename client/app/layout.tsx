import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FarmHarbor | Find Your Next Farm Adventure",
  description: "Discover and book unique farm experiences, from fruit picking to farm stays.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800`}>
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <Link href="/" className="text-2xl font-bold text-green-700">
                FarmHarbor
              </Link>
              <nav className="space-x-6">
                <Link href="/" className="text-gray-600 hover:text-green-700 transition-colors">
                  Home
                </Link>
                <Link href="#" className="text-gray-600 hover:text-green-700 transition-colors">
                  My Bookings
                </Link>
                <Link href="#" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Sign In
                </Link>
              </nav>
            </div>
          </div>
        </header>

        <main className="min-h-screen">
          {children}
        </main>

        <footer className="bg-gray-800 text-white">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
            <p>&copy; {new Date().getFullYear()} FarmHarbor. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
