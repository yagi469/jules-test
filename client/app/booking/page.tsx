"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// A simplified interface for the farm info we need
interface FarmInfo {
  id: string;
  name: string;
}

export default function BookingPage() {
  const router = useRouter();
  const [farmInfo, setFarmInfo] = useState<FarmInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Retrieve farm details from localStorage, which are set on the farm details page
    const farmId = localStorage.getItem('bookingFarmId');
    const farmName = localStorage.getItem('bookingFarmName');

    if (farmId && farmName) {
      setFarmInfo({ id: farmId, name: farmName });
    }
    setIsLoading(false);

    // It's better not to clean up here, in case the user reloads the page.
    // Let's clean it up upon successful submission or when leaving the page.
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!farmInfo) return;

    const formData = new FormData(e.currentTarget);
    const bookingDetails = {
      farmId: farmInfo.id,
      farmName: farmInfo.name,
      date: formData.get('date'),
      time: formData.get('time'),
      participants: formData.get('participants'),
      name: formData.get('name'),
      email: formData.get('email')
    };

    // Storing details for confirmation page
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));

    // Clean up the farm details from localStorage after using them
    localStorage.removeItem('bookingFarmId');
    localStorage.removeItem('bookingFarmName');

    router.push('/confirmation');
  };

  if (isLoading) {
     return (
      <section className="bg-white p-5 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">読み込み中...</h2>
      </section>
    );
  }

  if (!farmInfo) {
    return (
      <section className="bg-white p-5 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">予約する農園が見つかりません</h2>
        <p className="mt-2">農園詳細ページから予約を続けてください。</p>
        <button onClick={() => router.push('/')} className="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          ホームに戻る
        </button>
      </section>
    );
  }

  return (
    <section className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">予約フォーム</h2>
      <p className="mb-4">
        <strong>農園名:</strong> {farmInfo.name}
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="date" className="font-bold mb-1 block">日付:</label>
          <input type="date" id="date" name="date" required className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label htmlFor="time" className="font-bold mb-1 block">時間:</label>
          <select id="time" name="time" required className="w-full p-2 border rounded-md">
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="13:00">13:00</option>
            <option value="14:00">14:00</option>
          </select>
        </div>

        <div>
          <label htmlFor="participants" className="font-bold mb-1 block">人数:</label>
          <input type="number" id="participants" name="participants" min="1" defaultValue="1" required className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label htmlFor="name" className="font-bold mb-1 block">氏名:</label>
          <input type="text" id="name" name="name" required className="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label htmlFor="email" className="font-bold mb-1 block">メールアドレス:</label>
          <input type="email" id="email" name="email" required className="w-full p-2 border rounded-md" />
        </div>

        <button type="submit" className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
          予約情報を確認する
        </button>
      </form>
    </section>
  );
}
