export interface Farm {
  id: number;
  name: string;
  location: string;
  products: string[];
  category: 'fruit' | 'vegetable' | 'grain';
  description: string;
  image: string;
}

export const farms: Farm[] = [
  {
    id: 1,
    name: '田中農園',
    location: '東京都元気市',
    products: ['トマト', 'きゅうり', 'なす'],
    category: 'vegetable',
    description: '都心からアクセス抜群！新鮮な有機野菜の収穫が楽しめます。家族みんなで土に触れ、食の大切さを学びませんか？',
    image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  },
  {
    id: 2,
    name: '山田ベリーファーム',
    location: '千葉県ハッピー町',
    products: ['いちご', 'ブルーベリー'],
    category: 'fruit',
    description: '甘くて美味しいベリー狩り体験！種類も豊富で、食べ比べが楽しめます。',
    image: '/berry-farm.jpg'
  },
  {
    id: 3,
    name: '佐藤水田',
    location: '新潟県米所市',
    products: ['米'],
    category: 'grain',
    description: '日本の原風景、田んぼでの稲刈り体験。美味しいお米のお土産付きです。',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];
