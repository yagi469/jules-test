"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { farms, Farm } from './data';

export default function HomePage() {
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>(farms);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = farms.filter(farm => {
      const matchesKeyword = farm.name.toLowerCase().includes(keyword.toLowerCase()) ||
                             farm.location.toLowerCase().includes(keyword.toLowerCase()) ||
                             farm.products.join('').toLowerCase().includes(keyword.toLowerCase());
      const matchesCategory = category ? farm.category === category : true;
      return matchesKeyword && matchesCategory;
    });
    setFilteredFarms(filtered);
  };

  return (
    <>
      <section className="bg-white p-5 mb-5 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">お気に入りの農園を見つけよう</h2>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="キーワード (例: いちご、東京)"
            className="p-2 border rounded-md flex-grow"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            className="p-2 border rounded-md"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">カテゴリ</option>
            <option value="fruit">果物</option>
            <option value="vegetable">野菜</option>
            <option value="grain">穀物</option>
          </select>
          <button type="submit" className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            検索
          </button>
        </form>
      </section>

      <section className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">農園リスト</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFarms.map(farm => (
            <div key={farm.id} className="border rounded-lg p-4 text-center">
              <Image src={farm.image} alt={farm.name} width={300} height={200} className="w-full h-32 object-cover mb-2 rounded-md" />
              <h3 className="font-bold">{farm.name}</h3>
              <p>{farm.location}</p>
              <Link href={`/farm/${farm.id}`} className="text-green-500 hover:underline mt-2 inline-block">
                詳細を見る
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
