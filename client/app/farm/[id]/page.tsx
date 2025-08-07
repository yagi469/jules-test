"use client";

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// --- Type Definitions ---
interface Farm {
  _id: string;
  name: string;
  description: string;
  location: string;
  products: string[];
}

interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
  };
  rating: number;
  comment: string;
  date: string;
}

// --- Helper Components ---

// StarRating Component
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
        &#9733;
      </span>
    );
  }
  return <div>{stars}</div>;
};


// ReviewList Component
const ReviewList = ({ reviews, isLoading, error }: { reviews: Review[], isLoading: boolean, error: string | null }) => {
  if (isLoading) return <p>レビューを読み込んでいます...</p>;
  if (error) return <p className="text-red-500">エラー: {error}</p>;
  if (reviews.length === 0) return <p>まだレビューはありません。</p>;

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="border-t pt-4">
          <div className="flex items-center mb-1">
            <p className="font-bold mr-2">{review.user?.name || '匿名ユーザー'}</p>
            <StarRating rating={review.rating} />
          </div>
          <p className="text-gray-600">{review.comment}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(review.date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

// ReviewForm Component
const ReviewForm = ({ farmId, onReviewSubmitted }: { farmId: string, onReviewSubmitted: () => void }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    // This is a placeholder. In a real app, you'd get the logged-in user's ID.
    const placeholderUserId = '60d5f3f5e7b3c2a4e8f3b3a0';

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farm: farmId,
          user: placeholderUserId,
          rating,
          comment,
        }),
      });

      if (!response.ok) {
        // Since the DB isn't connected, this will likely always fail.
        // We'll provide feedback to the user.
        const errorData = await response.json().catch(() => ({ message: 'レビューの投稿に失敗しました。サーバーが応答しませんでした。' }));
        throw new Error(errorData.message || 'レビューの投稿に失敗しました。');
      }

      // Reset form and refresh reviews
      setComment('');
      setRating(5);
      onReviewSubmitted();

    } catch (err) {
      setError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t pt-4 mt-4 mb-8">
      <h4 className="font-bold mb-2">レビューを投稿する</h4>
      {error && <p className="text-red-500 bg-red-100 p-2 rounded-md mb-2">{error}</p>}
      <div className="mb-2">
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700">評価</label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
        >
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </div>
      <div className="mb-2">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700">コメント</label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
          placeholder="素晴らしい体験でした！"
        ></textarea>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
      >
        {submitting ? '投稿中...' : '投稿する'}
      </button>
    </form>
  );
};


// --- Main Page Component ---
export default function FarmDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();

  // Farm State
  const [farm, setFarm] = useState<Farm | null>(null);
  const [farmLoading, setFarmLoading] = useState(true);
  const [farmError, setFarmError] = useState<string | null>(null);

  // Review State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  // Fetch Reviews Function
  const fetchReviews = async (farmId: string) => {
    setReviewsLoading(true);
    setReviewsError(null);
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/reviews?farmId=${farmId}`);
      if (!response.ok) {
        throw new Error('レビューの取得に失敗しました。');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      // Since the DB isn't connected, this will likely fail or return empty.
      // We will show an empty state, but not a harsh error.
      console.error(err);
      setReviewsError('レビューを読み込めませんでした。');
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      const fetchFarm = async () => {
        setFarmLoading(true);
        try {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
          const response = await fetch(`${apiBaseUrl}/api/farms/${params.id}`);
          if (!response.ok) {
            throw new Error('農園データの取得に失敗しました。');
          }
          const data = await response.json();
          setFarm(data);
        } catch (err) {
          setFarmError(err instanceof Error ? err.message : '不明なエラーが発生しました。');
        } finally {
          setFarmLoading(false);
        }
      };
      fetchFarm();
      fetchReviews(params.id);
    }
  }, [params.id]);

  const handleBookingClick = () => {
    if (farm) {
      localStorage.setItem('bookingFarmId', farm._id);
      localStorage.setItem('bookingFarmName', farm.name);
      router.push('/booking');
    }
  };

  if (farmLoading) {
    return (
      <section className="bg-white p-5 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold">農園情報を読み込み中...</h2>
      </section>
    );
  }

  if (farmError) {
    return (
      <section className="bg-white p-5 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-red-500">エラー</h2>
        <p>{farmError}</p>
        <Link href="/" className="text-green-500 hover:underline mt-4 inline-block">
          ホームに戻る
        </Link>
      </section>
    );
  }

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
      <Image
        src="https://via.placeholder.com/500x333"
        alt={farm.name}
        width={500}
        height={333}
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

      {/* Reviews Section */}
      <div className="reviews mt-8">
        <h3 className="text-lg font-bold mb-4">レビュー</h3>
        <ReviewForm farmId={farm._id} onReviewSubmitted={() => fetchReviews(farm._id)} />
        <ReviewList reviews={reviews} isLoading={reviewsLoading} error={reviewsError} />
      </div>
    </section>
  );
}
