"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface BookingDetails {
  farmName: string;
  date: string;
  time: string;
  participants: string;
}

export default function ConfirmationPage() {
  const [details, setDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    const storedDetails = localStorage.getItem('bookingDetails');
    if (storedDetails) {
      setDetails(JSON.parse(storedDetails));
      localStorage.removeItem('bookingDetails');
    }
  }, []);

  return (
    <section className="bg-white p-5 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">ご予約ありがとうございます！</h2>

      {details ? (
        <>
          <p>以下の内容で予約を承りました。</p>
          <div className="border-t border-b py-4 my-4 inline-block text-left">
            <p><strong>農園名:</strong> {details.farmName}</p>
            <p><strong>日付:</strong> {details.date}</p>
            <p><strong>時間:</strong> {details.time}</p>
            <p><strong>人数:</strong> {details.participants}名</p>
          </div>
          <p>詳細は確認メールをご確認ください。</p>
        </>
      ) : (
        <p>予約情報が見つかりません。</p>
      )}

      <Link href="/" className="inline-block bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-4">
        ホームに戻る
      </Link>
    </section>
  );
}
