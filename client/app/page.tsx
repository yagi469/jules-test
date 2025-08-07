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
      <section className="relative h-[500px] flex items-center justify-center text-white">
        <Image
          src="https://images.unsplash.com/photo-1492496913980-501348b61469?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="A beautiful farm landscape"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute z-0"
          priority
        />
        <div className="relative z-10 text-center p-8 bg-black bg-opacity-50 rounded-xl">
          <h1 className="text-5xl font-extrabold mb-4 text-shadow-lg">最高の農園体験を見つけよう</h1>
          <p className="text-xl mb-8 text-shadow-md">地元の農園、新鮮な農産物、そしてユニークな農業アドベンチャーを発見してください。</p>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="キーワード (例: いちご, 東京)"
              className="p-3 border-transparent rounded-md flex-grow bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <select
              className="p-3 border-transparent rounded-md bg-white bg-opacity-90 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">すべてのカテゴリ</option>
              <option value="fruit">果物</option>
              <option value="vegetable">野菜</option>
              <option value="grain">穀物</option>
            </select>
            <button type="submit" className="p-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-300">
              検索
            </button>
          </form>
        </div>
      </section>

      <section className="bg-gray-50 p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">注目の農園</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFarms.map(farm => (
            <div key={farm.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:shadow-xl">
              <Image src={farm.image} alt={farm.name} width={400} height={250} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{farm.name}</h3>
                <p className="text-gray-600 mb-4">{farm.location}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {farm.products.map(product => (
                    <span key={product} className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      {product}
                    </span>
                  ))}
                </div>
                <Link href={`/farm/${farm.id}`} className="inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300">
                  詳細を見る
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
