const fs = require('fs');
const path = require('path');

// Mock data generator (simulating scraping)
// In the future, replace this with axios/cheerio logic
const generateData = () => {
    const today = new Date().toISOString().split('T')[0];
    console.log(`Generating data for ${today}...`);

    const cities = [
        { id: '34', name: 'İstanbul' },
        { id: '06', name: 'Ankara' },
        { id: '07', name: 'Antalya' },
        { id: '33', name: 'Mersin' },
        { id: '35', name: 'İzmir' },
    ];

    const districts = [
        { id: '34-1', cityId: '34', name: 'Bayrampaşa Hali' },
        { id: '34-2', cityId: '34', name: 'Ataşehir Hali' },
        { id: '06-1', cityId: '06', name: 'Ankara Toptancı Hali' },
        { id: '07-1', cityId: '07', name: 'Antalya Merkez Hali' },
        { id: '07-2', cityId: '07', name: 'Gazipaşa Hali' },
        { id: '07-3', cityId: '07', name: 'Kumluca Hali' },
        { id: '33-1', cityId: '33', name: 'Mersin Merkez Hali' },
        { id: '35-1', cityId: '35', name: 'İzmir Merkez Hali' },
    ];

    const baseItems = [
        { id: '1', name: 'Domates (Salkım)', category: 'Sebze', unit: 'kg', basePrice: 30 },
        { id: '2', name: 'Domates (Beef)', category: 'Sebze', unit: 'kg', basePrice: 38 },
        { id: '3', name: 'Salatalık', category: 'Sebze', unit: 'kg', basePrice: 18 },
        { id: '4', name: 'Biber (Çarliston)', category: 'Sebze', unit: 'kg', basePrice: 24 },
        { id: '5', name: 'Patlıcan', category: 'Sebze', unit: 'kg', basePrice: 22 },
        { id: '6', name: 'Patates', category: 'Sebze', unit: 'kg', basePrice: 15 },
        { id: '7', name: 'Soğan (Kuru)', category: 'Sebze', unit: 'kg', basePrice: 13 },
        { id: '8', name: 'Elma (Starking)', category: 'Meyve', unit: 'kg', basePrice: 25 },
        { id: '9', name: 'Muz (Yerli)', category: 'Meyve', unit: 'kg', basePrice: 40 },
        { id: '10', name: 'Portakal (Washington)', category: 'Meyve', unit: 'kg', basePrice: 18 },
        { id: '11', name: 'Limon', category: 'Meyve', unit: 'kasa', basePrice: 175 },
        { id: '12', name: 'Çilek', category: 'Meyve', unit: 'kg', basePrice: 75 },
    ];

    const marketData = {
        lastUpdated: today,
        cities,
        districts,
        prices: {} // Key: "cityId-districtId", Value: MarketItem[]
    };

    // Generate prices for each district with some random variation
    districts.forEach(district => {
        const districtPrices = baseItems.map(item => {
            const variation = (Math.random() * 4) - 2; // +/- 2 TL
            const avgPrice = Math.round((item.basePrice + variation) * 10) / 10;
            const lowPrice = Math.round((avgPrice * 0.9) * 10) / 10;
            const highPrice = Math.round((avgPrice * 1.1) * 10) / 10;

            return {
                ...item,
                lowPrice,
                highPrice,
                avgPrice,
                trend: Math.random() > 0.5 ? 'up' : 'down'
            };
        });

        marketData.prices[`${district.cityId}-${district.id}`] = districtPrices;
    });

    return marketData;
};

const saveData = (data) => {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }

    const filePath = path.join(dataDir, 'marketData.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Data saved to ${filePath}`);
};

const run = () => {
    try {
        const data = generateData();
        saveData(data);
    } catch (error) {
        console.error('Error generating data:', error);
        process.exit(1);
    }
};

run();
