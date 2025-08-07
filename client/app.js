document.addEventListener('DOMContentLoaded', () => {
    // Hardcoded farm data
    const farms = [
        {
            id: 1,
            name: '田中農園',
            location: '東京都元気市',
            products: ['トマト', 'きゅうり', 'なす'],
            category: 'vegetable',
            description: '都心からアクセス抜群！新鮮な有機野菜の収穫が楽しめます。家族みんなで土に触れ、食の大切さを学びませんか？',
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 2,
            name: '山田ベリーファーム',
            location: '千葉県ハッピー町',
            products: ['いちご', 'ブルーベリー'],
            category: 'fruit',
            description: '甘くて美味しいベリー狩り体験！種類も豊富で、食べ比べが楽しめます。',
            image: 'https://via.placeholder.com/300x200'
        },
        {
            id: 3,
            name: '佐藤水田',
            location: '新潟県米所市',
            products: ['米'],
            category: 'grain',
            description: '日本の原風景、田んぼでの稲刈り体験。美味しいお米のお土産付きです。',
            image: 'https://via.placeholder.com/300x200'
        }
    ];

    // --- Homepage Logic ---
    if (document.getElementById('farm-list')) {
        const farmList = document.getElementById('farm-list');
        const searchForm = document.getElementById('search-form');

        const displayFarms = (filteredFarms) => {
            farmList.innerHTML = '';
            filteredFarms.forEach(farm => {
                const farmCard = document.createElement('div');
                farmCard.className = 'farm-card';
                farmCard.innerHTML = `
                    <img src="${farm.image}" alt="${farm.name}" style="max-width: 100%;">
                    <h3>${farm.name}</h3>
                    <p>${farm.location}</p>
                    <a href="farm-details.html?id=${farm.id}">詳細を見る</a>
                `;
                farmList.appendChild(farmCard);
            });
        };

        // Initial display
        displayFarms(farms);

        // Search functionality
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keyword = document.getElementById('keyword').value.toLowerCase();
            const category = document.getElementById('category').value;

            const filtered = farms.filter(farm => {
                const matchesKeyword = farm.name.toLowerCase().includes(keyword) ||
                                     farm.location.toLowerCase().includes(keyword) ||
                                     farm.products.join('').toLowerCase().includes(keyword);
                const matchesCategory = category ? farm.category === category : true;
                return matchesKeyword && matchesCategory;
            });
            displayFarms(filtered);
        });
    }

    // --- Farm Details Page Logic ---
    if (document.querySelector('.farm-details')) {
        const urlParams = new URLSearchParams(window.location.search);
        const farmId = parseInt(urlParams.get('id'));
        const farm = farms.find(f => f.id === farmId);

        if (farm) {
            document.getElementById('farm-name').textContent = farm.name;
            document.getElementById('farm-image').src = farm.image;
            document.getElementById('farm-description').textContent = farm.description;
            document.getElementById('farm-location').textContent = farm.location;
            document.getElementById('farm-products').textContent = farm.products.join(', ');
            document.querySelector('.btn-booking').href = `booking.html?id=${farm.id}`;
        }
    }

    // --- Booking Page Logic ---
    if (document.getElementById('booking-form')) {
        const urlParams = new URLSearchParams(window.location.search);
        const farmId = parseInt(urlParams.get('id'));
        const farm = farms.find(f => f.id === farmId);

        if (farm) {
            document.getElementById('booking-farm-name').textContent = farm.name;
        }

        const bookingForm = document.getElementById('booking-form');
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bookingDetails = {
                farmName: farm ? farm.name : '不明',
                date: document.getElementById('date').value,
                time: document.getElementById('time').value,
                participants: document.getElementById('participants').value
            };
            // Store details in localStorage to pass to confirmation page
            localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
            window.location.href = 'confirmation.html';
        });
    }

    // --- Confirmation Page Logic ---
    if (document.querySelector('.confirmation-message')) {
        const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
        if (bookingDetails) {
            document.getElementById('conf-farm-name').textContent = bookingDetails.farmName;
            document.getElementById('conf-date').textContent = bookingDetails.date;
            document.getElementById('conf-time').textContent = bookingDetails.time;
            document.getElementById('conf-participants').textContent = `${bookingDetails.participants}名`;
            // Clear localStorage after displaying
            localStorage.removeItem('bookingDetails');
        }
    }
});
