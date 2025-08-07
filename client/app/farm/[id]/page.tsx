"use client"; // Make this a client component to use localStorage and router

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { farms } from '../../data';

export default function FarmDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const farm = farms.find(f => f.id === parseInt(params.id));

  const handleBookingClick = () => {
    if (farm) {
      localStorage.setItem('bookingFarmId', farm.id.toString());
      router.push('/booking');
    }
  };

  if (!farm) {
    return (
      <section className="bg-white p-5 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">農園が見つかりません</h2>
        <Link href="/" className="text-green-500 hover:underline mt-4 inline-block">
          ホームに戻る
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-white p-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{farm.name}</h2>
      <img
        src={farm.image}
        alt={farm.name}
        className="w-full h-64 object-cover rounded-lg mb-4"
      />
      <p>{farm.description}</p>

      <h3 className="text-lg font-bold mt-6 mb-2">基本情報</h3>
      <ul className="list-disc list-inside">
        <li><strong>場所:</strong> {farm.location}</li>
        <li><strong>収穫できる作物:</strong> {farm.products.join(', ')}</li>
      </ul>

      <button
        onClick={handleBookingClick}
        className="inline-block bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 mt-4"
      >
        この農園を予約する
      </button>

      <div className="reviews mt-8">
        <h3 className="text-lg font-bold mb-2">レビュー</h3>
        {/* Static reviews for now */}
        <div className="border-t pt-4 mt-4">
          <p><strong>佐藤さん:</strong> ★★★★★</p>
          <p>子供たちが大喜びでした！また来たいです。</p>
        </div>
        <div className="border-t pt-4 mt-4">
          <p><strong>鈴木さん:</strong> ★★★★☆</p>
          <p>とても新鮮な野菜が収穫できました。</p>
        </div>
      </div>
    </section>
  );
}
