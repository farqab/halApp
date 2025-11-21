export interface City {
    id: string;
    name: string;
}

export interface District {
    id: string;
    cityId: string;
    name: string;
}

export interface MarketItem {
    id: string;
    name: string;
    category: 'Meyve' | 'Sebze';
    unit: 'kg' | 'kasa' | 'adet' | 'bağ';
    lowPrice: number;
    highPrice: number;
    avgPrice: number;
    trend: 'up' | 'down' | 'stable';
}

export const CITIES: City[] = [
    { id: '34', name: 'İstanbul' },
    { id: '06', name: 'Ankara' },
    { id: '07', name: 'Antalya' },
    { id: '33', name: 'Mersin' },
    { id: '35', name: 'İzmir' },
];

export const DISTRICTS: District[] = [
    { id: '34-1', cityId: '34', name: 'Bayrampaşa Hali' },
    { id: '34-2', cityId: '34', name: 'Ataşehir Hali' },
    { id: '06-1', cityId: '06', name: 'Ankara Toptancı Hali' },
    { id: '07-1', cityId: '07', name: 'Antalya Merkez Hali' },
    { id: '07-2', cityId: '07', name: 'Gazipaşa Hali' },
    { id: '07-3', cityId: '07', name: 'Kumluca Hali' },
    { id: '33-1', cityId: '33', name: 'Mersin Merkez Hali' },
    { id: '35-1', cityId: '35', name: 'İzmir Merkez Hali' },
];

const MOCK_ITEMS: MarketItem[] = [
    { id: '1', name: 'Domates (Salkım)', category: 'Sebze', unit: 'kg', lowPrice: 25, highPrice: 35, avgPrice: 30, trend: 'up' },
    { id: '2', name: 'Domates (Beef)', category: 'Sebze', unit: 'kg', lowPrice: 30, highPrice: 45, avgPrice: 38, trend: 'stable' },
    { id: '3', name: 'Salatalık', category: 'Sebze', unit: 'kg', lowPrice: 15, highPrice: 22, avgPrice: 18, trend: 'down' },
    { id: '4', name: 'Biber (Çarliston)', category: 'Sebze', unit: 'kg', lowPrice: 20, highPrice: 28, avgPrice: 24, trend: 'up' },
    { id: '5', name: 'Patlıcan', category: 'Sebze', unit: 'kg', lowPrice: 18, highPrice: 25, avgPrice: 22, trend: 'stable' },
    { id: '6', name: 'Patates', category: 'Sebze', unit: 'kg', lowPrice: 12, highPrice: 18, avgPrice: 15, trend: 'stable' },
    { id: '7', name: 'Soğan (Kuru)', category: 'Sebze', unit: 'kg', lowPrice: 10, highPrice: 16, avgPrice: 13, trend: 'down' },
    { id: '8', name: 'Elma (Starking)', category: 'Meyve', unit: 'kg', lowPrice: 20, highPrice: 30, avgPrice: 25, trend: 'stable' },
    { id: '9', name: 'Muz (Yerli)', category: 'Meyve', unit: 'kg', lowPrice: 35, highPrice: 45, avgPrice: 40, trend: 'up' },
    { id: '10', name: 'Portakal (Washington)', category: 'Meyve', unit: 'kg', lowPrice: 15, highPrice: 22, avgPrice: 18, trend: 'down' },
    { id: '11', name: 'Limon', category: 'Meyve', unit: 'kasa', lowPrice: 150, highPrice: 200, avgPrice: 175, trend: 'up' },
    { id: '12', name: 'Çilek', category: 'Meyve', unit: 'kg', lowPrice: 60, highPrice: 90, avgPrice: 75, trend: 'down' },
];

// Simulate slightly different prices for different locations
export const getMarketPrices = (cityId: string, districtId: string): MarketItem[] => {
    const modifier = parseInt(cityId) % 5;
    return MOCK_ITEMS.map(item => ({
        ...item,
        lowPrice: item.lowPrice + modifier,
        highPrice: item.highPrice + modifier,
        avgPrice: item.avgPrice + modifier,
    }));
};

export const getCities = () => CITIES;
export const getDistricts = (cityId: string) => DISTRICTS.filter(d => d.cityId === cityId);
