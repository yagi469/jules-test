"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// APIから取得する農園データの型を定義
interface Farm {
  _id: string;
  name: string;
  location: string;
  products: string[];
  description: string;
  // The API doesn't have category or image, so we omit them or use placeholders
}

export default function HomePage() {
  const [allFarms, setAllFarms] = useState<Farm[]>([]);
  const [filteredFarms, setFilteredFarms] = useState<Farm[]>([]);
  const [keyword, setKeyword] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFarms = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBaseUrl}/api/farms`);
        if (!response.ok) {
          throw new Error('農園データの取得に失敗しました。');
        }
        const data: Farm[] = await response.json();
        setAllFarms(data);
        setFilteredFarms(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
      } finally {
        setLoading(false);
      }
    };
    fetchFarms();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = allFarms.filter(farm => {
      return farm.name.toLowerCase().includes(keyword.toLowerCase()) ||
             farm.location.toLowerCase().includes(keyword.toLowerCase()) ||
             farm.products.join('').toLowerCase().includes(keyword.toLowerCase());
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
          <h1 className="text-5xl font-extrabold mb-4 text-shadow-lg">Find Your Perfect Farm Experience</h1>
          <p className="text-xl mb-8 text-shadow-md">Discover local farms, fresh produce, and unique agricultural adventures.</p>
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Keyword (e.g., strawberries, Tokyo)"
              className="p-3 border-transparent rounded-md flex-grow bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:outline-none"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            {/* Category filter removed as it's not in the backend data */}
            <button type="submit" className="p-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition-colors duration-300">
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="bg-gray-50 p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Featured Farms</h2>
        {loading && <p className="text-center">Loading farms...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFarms.map(farm => (
              <div key={farm._id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 ease-in-out hover:shadow-xl">
                <Image
                  src="https://via.placeholder.com/400x250" // Placeholder image
                  alt={farm.name}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
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
                  <Link href={`/farm/${farm._id}`} className="inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors duration-300">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
