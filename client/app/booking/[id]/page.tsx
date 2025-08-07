"use client";

import { useRouter } from 'next/navigation';
import { farms } from '../../data';

export default function BookingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const farm = farms.find(f => f.id === parseInt(params.id));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const bookingDetails = {
      farmName: farm ? farm.name : '不明',
      date: formData.get('date'),
      time: formData.get('time'),
      participants: formData.get('participants')
    };
    // Store details in localStorage to pass to confirmation page
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    router.push('/confirmation');
  };

  if (!farm) {
    return (
      <section className="bg-white p-5 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">農園が見つかりません</h2>
      </section>
    );
  }

  return (
    <section className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">予約フォーム</h2>
      <p className="mb-4">
        <strong>農園名:</strong> {farm.name}
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
          予約を確定する
        </button>
      </form>
    </section>
  );
}
