const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

// Helper to delay requests (avoid rate limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Standardize category names
const normalizeCategory = (cat) => {
    const lower = cat.toLowerCase();
    if (lower.includes('sebze')) return 'Sebze';
    if (lower.includes('meyve')) return 'Meyve';
    return 'Diğer';
};

// --- SCRAPING FUNCTIONS ---

// 1. Istanbul (Simulated for now as IBB API requires auth/complex parsing, using mock fallback structure but ready for real URL)
const scrapeIstanbul = async () => {
    console.log('Scraping Istanbul...');
    // Note: Real IBB Hal data is often behind a complex web app. 
    // For this demo, we will generate realistic data based on typical market values
    // In a production app, we would need a dedicated API key or headless browser for IBB.
    return [
        { name: 'Domates', category: 'Sebze', unit: 'kg', lowPrice: 25, highPrice: 35, avgPrice: 30 },
        { name: 'Salatalık', category: 'Sebze', unit: 'kg', lowPrice: 20, highPrice: 25, avgPrice: 22.5 },
        { name: 'Biber (Sivri)', category: 'Sebze', unit: 'kg', lowPrice: 30, highPrice: 40, avgPrice: 35 },
        { name: 'Patlıcan', category: 'Sebze', unit: 'kg', lowPrice: 20, highPrice: 28, avgPrice: 24 },
        { name: 'Elma', category: 'Meyve', unit: 'kg', lowPrice: 25, highPrice: 35, avgPrice: 30 },
        { name: 'Muz (Yerli)', category: 'Meyve', unit: 'kg', lowPrice: 40, highPrice: 50, avgPrice: 45 },
    ];
};

// 2. Ankara (ankara.bel.tr)
const scrapeAnkara = async () => {
    console.log('Scraping Ankara...');
    try {
        // Example URL - often changes, would need constant maintenance
        // Using a realistic static set for stability in this demo phase
        // Real implementation would require parsing the specific HTML table structure of ankara.bel.tr
        return [
            { name: 'Domates', category: 'Sebze', unit: 'kg', lowPrice: 20, highPrice: 30, avgPrice: 25 },
            { name: 'Salatalık', category: 'Sebze', unit: 'kg', lowPrice: 15, highPrice: 20, avgPrice: 17.5 },
            { name: 'Patates', category: 'Sebze', unit: 'kg', lowPrice: 10, highPrice: 15, avgPrice: 12.5 },
            { name: 'Soğan', category: 'Sebze', unit: 'kg', lowPrice: 8, highPrice: 12, avgPrice: 10 },
        ];
    } catch (e) {
        console.error('Ankara scrape failed:', e.message);
        return [];
    }
};

// 3. Antalya (antalya.bel.tr)
const scrapeAntalya = async () => {
    console.log('Scraping Antalya...');
    // Antalya is the hub, prices are generally lower
    return [
        { name: 'Domates', category: 'Sebze', unit: 'kg', lowPrice: 15, highPrice: 25, avgPrice: 20 },
        { name: 'Biber (Kapya)', category: 'Sebze', unit: 'kg', lowPrice: 25, highPrice: 35, avgPrice: 30 },
        { name: 'Portakal', category: 'Meyve', unit: 'kg', lowPrice: 10, highPrice: 15, avgPrice: 12.5 },
        { name: 'Avokado', category: 'Meyve', unit: 'adet', lowPrice: 15, highPrice: 30, avgPrice: 22.5 },
    ];
};

// 4. Mersin
const scrapeMersin = async () => {
    console.log('Scraping Mersin...');
    return [
        { name: 'Limon', category: 'Meyve', unit: 'kg', lowPrice: 10, highPrice: 15, avgPrice: 12.5 },
        { name: 'Muz (Yerli)', category: 'Meyve', unit: 'kg', lowPrice: 35, highPrice: 45, avgPrice: 40 },
        { name: 'Çilek', category: 'Meyve', unit: 'kg', lowPrice: 60, highPrice: 80, avgPrice: 70 },
    ];
};

// 5. Izmir
const scrapeIzmir = async () => {
    console.log('Scraping Izmir...');
    return [
        { name: 'Enginar', category: 'Sebze', unit: 'adet', lowPrice: 25, highPrice: 35, avgPrice: 30 },
        { name: 'Bakla', category: 'Sebze', unit: 'kg', lowPrice: 30, highPrice: 40, avgPrice: 35 },
        { name: 'İncir', category: 'Meyve', unit: 'kg', lowPrice: 80, highPrice: 120, avgPrice: 100 },
    ];
};

// Main Runner
const run = async () => {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Starting scrape for ${today}...`);

    const cities = [
        { id: '34', name: 'İstanbul' },
        { id: '06', name: 'Ankara' },
        { id: '07', name: 'Antalya' },
        { id: '33', name: 'Mersin' },
        { id: '35', name: 'İzmir' },
    ];

    const districts = [
        { id: '34-1', cityId: '34', name: 'Bayrampaşa Hali' },
        { id: '06-1', cityId: '06', name: 'Ankara Toptancı Hali' },
        { id: '07-1', cityId: '07', name: 'Antalya Merkez Hali' },
        { id: '33-1', cityId: '33', name: 'Mersin Merkez Hali' },
        { id: '35-1', cityId: '35', name: 'İzmir Merkez Hali' },
    ];

    const marketData = {
        lastUpdated: today,
        cities,
        districts,
        prices: {}
    };

    try {
        // Fetch data (Simulated async requests for now to ensure stability)
        // In a real deployment, these would be the actual axios calls
        const istanbulData = await scrapeIstanbul();
        const ankaraData = await scrapeAnkara();
        const antalyaData = await scrapeAntalya();
        const mersinData = await scrapeMersin();
        const izmirData = await scrapeIzmir();

        // Map data to districts
        // Note: We are mapping city-wide data to the main district of that city
        const mapDataToItems = (data, startId) => {
            return data.map((item, index) => ({
                id: `${startId}-${index}`,
                ...item,
                trend: Math.random() > 0.5 ? 'up' : 'down' // Trend is calculated from history in real app
            }));
        };

        marketData.prices['34-1'] = mapDataToItems(istanbulData, 100);
        marketData.prices['06-1'] = mapDataToItems(ankaraData, 200);
        marketData.prices['07-1'] = mapDataToItems(antalyaData, 300);
        marketData.prices['33-1'] = mapDataToItems(mersinData, 400);
        marketData.prices['35-1'] = mapDataToItems(izmirData, 500);

        // Save Data
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir);
        }

        const filePath = path.join(dataDir, 'marketData.json');
        fs.writeFileSync(filePath, JSON.stringify(marketData, null, 2));
        console.log(`Data saved to ${filePath}`);

    } catch (error) {
        console.error('Scraping failed:', error);
        process.exit(1);
    }
};

run();
