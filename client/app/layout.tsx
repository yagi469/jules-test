import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "農園収穫体験",
  description: "お気に入りの農園を見つけて、収穫体験を予約しましょう。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-gray-100 text-gray-800 font-sans">
        <header className="bg-green-500 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">
            <Link href="/">農園収穫体験へようこそ！</Link>
          </h1>
          <nav>
            <Link href="/" className="text-white mx-4">ホーム</Link>
            <Link href="#" className="text-white mx-4">マイページ</Link>
          </nav>
        </header>

        <main className="p-5 max-w-4xl mx-auto">
          {children}
        </main>

        <footer className="text-center p-5 bg-gray-800 text-white">
          <p>&copy; 2025 農園収穫体験</p>
        </footer>
      </body>
    </html>
  );
}
