document.addEventListener('DOMContentLoaded', () => {
    const bouquet = document.getElementById('bouquet');

    // ========== BUKET AYARLARI ==========

    // DEBUG MODU: Animasyonları açıp kapatmak için (boy ayarlarını test ederken kullanışlı)
    const enableAnimations = true;  // false yapınca tüm animasyonlar kapanır, true yapınca açılır

    // TOPLAM ÇİÇEK SAYISI: Buketteki toplam çiçek sayısını ayarlayın
    const flowerCount = 12;  // Önerilen: 10-20 arası

    // ÇİÇEKLERİN YAYILMA ALANI: Çiçeklerin ne kadar geniş bir alanda dağılacağını ayarlayın
    const spreadWidth = 15;  // Çiçekler arası mesafe (piksel) - Önerilen: 15-25 arası
    // Daha küçük değer = daha dar buket, Daha büyük değer = daha geniş buket

    // Her çiçek için önceden belirlenmiş pozisyonlar (daha dengeli dağılım için)
    const flowerPositions = [
        { xMultiplier: -2.5, heightMultiplier: 0.4 },  // Sol dış
        { xMultiplier: -2.0, heightMultiplier: 0.8 },  // Sol
        { xMultiplier: -1.5, heightMultiplier: 0.3 },  // Sol orta-kısa
        { xMultiplier: -1.0, heightMultiplier: 0.6 },  // Sol orta
        { xMultiplier: -0.5, heightMultiplier: 0.4 },  // Sol merkez
        { xMultiplier: 0.0, heightMultiplier: 0.9 },   // Tam merkez-uzun
        { xMultiplier: 0.5, heightMultiplier: 0.6 },   // Sağ merkez
        { xMultiplier: 1.0, heightMultiplier: 1.0 },   // Sağ orta
        { xMultiplier: 1.5, heightMultiplier: 0.6 },   // Sağ orta-kısa
        { xMultiplier: 2.5, heightMultiplier: 0.9 },   // Sağ
        { xMultiplier: 3.0, heightMultiplier: 0.4 },   // Sağ dış
        { xMultiplier: 0.0, heightMultiplier: 0.3 }    // Merkez-kısa (ön)
    ];

    // ====================================

    const baseDelay = 500;

    // Create the bouquet
    createBouquet();

    function createBouquet() {
        // Generate flowers
        for (let i = 0; i < flowerCount; i++) {
            createFlower(i);
        }
    }

    function createFlower(index) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('flower-wrapper');

        // Fan out flowers from the center of the bouquet wrap
        // We want them to look like they are coming out of the cone
        const angle = (index / flowerCount) * Math.PI * 0.6 - (Math.PI * 0.3); // Narrower fan

        // ÇİÇEK BOYU AYARLARI: Çiçeklerin minimum ve maksimum boyunu ayarlayın (piksel cinsinden)
        const minFlowerHeight = 150;  // Minimum çiçek boyu
        const maxFlowerHeight = 220;  // Maksimum ek boy (toplam = min + max)

        // Önceden belirlenmiş pozisyon kullan
        const position = flowerPositions[index];
        const finalHeight = minFlowerHeight + (maxFlowerHeight * position.heightMultiplier);

        // Çiçekleri yatay olarak kaydırmak için offsetAdjustment değerini ayarlayın (negatif = sola, pozitif = sağa)
        const offsetAdjustment = -25;

        // Önceden belirlenmiş pozisyon kullan (çok az rastgelelik)
        const randomVariation = (Math.random() * 4 - 2); // Çok az rastgelelik
        const xOffset = (position.xMultiplier * spreadWidth * 2) + randomVariation + offsetAdjustment;

        const scale = 0.5 + Math.random() * 0.4;

        // Z-index'i yüksekliğe göre ayarla (küçük çiçekler önde, büyük çiçekler arkada)
        const maxZIndex = Math.floor(maxFlowerHeight / 30);
        const zIndex = maxZIndex - Math.floor((finalHeight - minFlowerHeight) / 30) + 1;

        // Set wrapper styles
        wrapper.style.height = '0px'; // Start at 0 height
        wrapper.style.left = `calc(50% + ${xOffset}px)`;
        wrapper.style.zIndex = zIndex;
        // Rotation is less extreme now as they come out of a wrap
        wrapper.style.transform = `rotate(${angle * 15}deg)`;

        // Create Stem
        const stem = document.createElement('div');
        stem.classList.add('stem');
        wrapper.appendChild(stem);

        // YAPRAK SAYISI AYARLARI: Her çiçekteki minimum ve maksimum yaprak sayısını ayarlayın
        const minLeafCount = 1;  // Minimum yaprak sayısı
        const maxLeafCount = 3;  // Maksimum yaprak sayısı
        const leafCount = Math.floor(Math.random() * (maxLeafCount - minLeafCount + 1)) + minLeafCount;
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('leaf');
            leaf.style.width = `${30 + Math.random() * 20}px`;
            leaf.style.height = `${15 + Math.random() * 10}px`;
            leaf.style.bottom = `${20 + Math.random() * 60}%`;
            leaf.style.left = i % 2 === 0 ? '0' : 'auto';
            leaf.style.right = i % 2 === 0 ? 'auto' : '0';
            leaf.style.transform = i % 2 === 0 ? 'rotate(-45deg)' : 'rotate(45deg) scaleX(-1)';
            wrapper.appendChild(leaf);
        }

        // Create Flower Head
        const head = document.createElement('div');
        head.classList.add('flower-head');
        head.style.width = `${100 * scale}px`;
        head.style.height = `${100 * scale}px`;
        head.style.bottom = '100%';
        head.style.marginBottom = '-15px';

        // Create Petals
        const layers = 8;
        const petalsPerLayer = [12, 16, 20, 24, 28, 32, 20, 10];

        const center = document.createElement('div');
        center.classList.add('center');
        head.appendChild(center);

        let layerIndex = 0;
        petalsPerLayer.forEach(count => {
            const layerRadius = 5 + layerIndex * 4;
            const petalHeight = 20 + layerIndex * 8;
            const petalWidth = 6 + layerIndex * 1.5;

            for (let i = 0; i < count; i++) {
                const petal = document.createElement('div');
                petal.classList.add('petal');

                const rotation = (i / count) * 360;
                const randomRot = rotation + (Math.random() * 5 - 2.5);

                petal.style.height = `${petalHeight}px`;
                petal.style.width = `${petalWidth}px`;
                petal.style.bottom = '50%';
                petal.style.left = '50%';
                petal.style.marginLeft = `-${petalWidth / 2}px`;

                const tilt = 10 + layerIndex * 10;
                petal.style.transform = `rotate(${randomRot}deg) translateY(-${layerRadius}px) rotateX(${tilt}deg)`;

                const lightness = 40 + layerIndex * 5;
                petal.style.background = `linear-gradient(to top, hsl(328, 100%, ${lightness - 10}%), hsl(330, 100%, ${lightness}%), hsl(330, 100%, ${lightness + 10}%))`;

                head.appendChild(petal);
            }
            layerIndex++;
        });

        wrapper.appendChild(head);
        bouquet.appendChild(wrapper);

        // Animate
        if (enableAnimations) {
            // Animasyonlar AÇIK - Normal animasyonlu açılış
            const wrapOpenDuration = 1500; // Poşet açılma süresi

            setTimeout(() => {
                wrapper.style.height = `${finalHeight}px`;
                wrapper.classList.add('visible'); // Show leaves

                setTimeout(() => {
                    head.classList.add('bloomed');
                }, 1500); // Bloom as stem finishes growing

            }, wrapOpenDuration + baseDelay + Math.random() * 1000);
        } else {
            // Animasyonlar KAPALI - Anında göster (debug modu)
            wrapper.style.height = `${finalHeight}px`;
            wrapper.classList.add('visible');
            head.classList.add('bloomed');
        }
    }

    // Mobilde love-message'ı message içine taşı
    function handleLoveMessagePosition() {
        const messageDiv = document.querySelector('.message');
        const loveMessageDiv = document.querySelector('.love-message');

        if (window.innerWidth <= 768) {
            // Mobilde: love-message'ı message içine taşı
            if (loveMessageDiv && messageDiv && loveMessageDiv.parentElement !== messageDiv) {
                messageDiv.appendChild(loveMessageDiv);
            }
        } else {
            // PC/Tablet'te: love-message'ı container içine taşı (sağ alt)
            const container = document.querySelector('.container');
            if (loveMessageDiv && container && loveMessageDiv.parentElement !== container) {
                container.appendChild(loveMessageDiv);
            }
        }
    }

    // Sayfa yüklendiğinde ve ekran boyutu değiştiğinde kontrol et
    handleLoveMessagePosition();
    window.addEventListener('resize', handleLoveMessagePosition);
});
