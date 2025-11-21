import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { City, District, CITIES, DISTRICTS, getMarketPrices } from '../data/mockData';

interface MarketContextType {
    selectedCity: City | null;
    selectedDistrict: District | null;
    favorites: string[];
    setCity: (city: City) => void;
    setDistrict: (district: District) => void;
    toggleFavorite: (itemId: string) => void;
    isLoading: boolean;
    marketData: any;
}

const MarketContext = createContext<MarketContextType | undefined>(undefined);

// URL to fetch data from (Raw GitHub content)
// REPLACE 'YOUR_USERNAME' and 'REPO_NAME' with actual values after pushing
const DATA_URL = 'https://raw.githubusercontent.com/farqab/halApp/main/data/marketData.json';

export const MarketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [marketData, setMarketData] = useState<any>(null);

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        try {
            const data = await fetchData();
            await loadPreferences(data);
        } catch (e) {
            console.error("Initialization failed", e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            // Try to fetch from network
            const response = await fetch(DATA_URL);
            if (response.ok) {
                const data = await response.json();
                setMarketData(data);
                console.log("Fetched remote data");
                return data;
            }
        } catch (e) {
            console.log("Network request failed, falling back to local/mock");
        }

        // Fallback: Use static mock data
        const fallbackData = {
            cities: CITIES,
            districts: DISTRICTS,
            prices: {} as any
        };

        // Generate prices map from static data
        DISTRICTS.forEach(d => {
            fallbackData.prices[d.id] = getMarketPrices(d.cityId, d.id);
        });

        setMarketData(fallbackData);
        console.log("Loaded static fallback data");
        return fallbackData;
    };

    const loadPreferences = async (data: any) => {
        try {
            const cityId = await AsyncStorage.getItem('selectedCityId');
            const districtId = await AsyncStorage.getItem('selectedDistrictId');
            const savedFavorites = await AsyncStorage.getItem('favorites');

            const availableCities = data?.cities || CITIES;
            const availableDistricts = data?.districts || DISTRICTS;

            let city = null;
            if (cityId) {
                city = availableCities.find((c: any) => c.id === cityId);
            }

            // If saved city not found or not set, use first available
            if (!city && availableCities.length > 0) {
                city = availableCities.find((c: any) => c.id === '34') || availableCities[0];
            }
            setSelectedCity(city);

            let district = null;
            if (districtId && city) {
                district = availableDistricts.find((d: any) => d.id === districtId && d.cityId === city.id);
            }

            // If saved district not found or not set, use first available for the city
            if (!district && city) {
                district = availableDistricts.find((d: any) => d.cityId === city.id) || null;
            }
            setSelectedDistrict(district);

            if (savedFavorites) {
                setFavorites(JSON.parse(savedFavorites));
            }
        } catch (e) {
            console.error("Failed to load preferences", e);
        }
    };

    const setCity = async (city: City) => {
        setSelectedCity(city);
        setSelectedDistrict(null);
        await AsyncStorage.setItem('selectedCityId', city.id);
        await AsyncStorage.removeItem('selectedDistrictId');
    };

    const setDistrict = async (district: District) => {
        setSelectedDistrict(district);
        await AsyncStorage.setItem('selectedDistrictId', district.id);
    };

    const toggleFavorite = async (itemId: string) => {
        const newFavorites = favorites.includes(itemId)
            ? favorites.filter(id => id !== itemId)
            : [...favorites, itemId];

        setFavorites(newFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
    };

    return (
        <MarketContext.Provider value={{
            selectedCity,
            selectedDistrict,
            favorites,
            setCity,
            setDistrict,
            toggleFavorite,
            isLoading,
            marketData
        }}>
            {children}
        </MarketContext.Provider>
    );
};

export const useMarket = () => {
    const context = useContext(MarketContext);
    if (context === undefined) {
        throw new Error('useMarket must be used within a MarketProvider');
    }
    return context;
};
