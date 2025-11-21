import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMarket } from '../context/MarketContext';
import { PriceCard } from '../components/PriceCard';

export default function HomeScreen() {
    const router = useRouter();
    const { selectedCity, selectedDistrict, favorites, toggleFavorite, isLoading, marketData } = useMarket();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<'Tümü' | 'Sebze' | 'Meyve'>('Tümü');

    const marketItems = useMemo(() => {
        if (!selectedCity || !selectedDistrict || !marketData) return [];

        // Look up prices in the fetched data
        // Key is just the district ID (e.g., "34-1")
        return marketData.prices[selectedDistrict.id] || [];
    }, [selectedCity, selectedDistrict, marketData]);

    const filteredItems = useMemo(() => {
        return marketItems.filter((item: any) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'Tümü' || item.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [marketItems, searchQuery, activeCategory]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hal Piyasası</Text>
                    <TouchableOpacity
                        style={styles.locationButton}
                        onPress={() => router.push('/city-selection')}
                    >
                        <Ionicons name="location" size={16} color="#007AFF" />
                        <Text style={styles.locationText}>
                            {selectedCity?.name}, {selectedDistrict?.name}
                        </Text>
                        <Ionicons name="chevron-down" size={16} color="#007AFF" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.profileButton}>
                    <Ionicons name="person-circle-outline" size={32} color="#1C1C1E" />
                </TouchableOpacity>
            </View>

            {/* Search & Filter */}
            <View style={styles.controls}>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Ürün ara..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#8E8E93"
                    />
                </View>

                <View style={styles.categories}>
                    {['Tümü', 'Sebze', 'Meyve'].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[
                                styles.categoryChip,
                                activeCategory === cat && styles.activeCategoryChip
                            ]}
                            onPress={() => setActiveCategory(cat as any)}
                        >
                            <Text style={[
                                styles.categoryText,
                                activeCategory === cat && styles.activeCategoryText
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Content */}
            <FlatList
                data={filteredItems}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <PriceCard
                        item={item}
                        isFavorite={favorites.includes(item.id)}
                        onToggleFavorite={() => toggleFavorite(item.id)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyStateText}>Ürün bulunamadı.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 4,
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    locationText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    profileButton: {
        padding: 4,
    },
    controls: {
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#1C1C1E',
        height: '100%',
    },
    categories: {
        flexDirection: 'row',
        gap: 12,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F2F2F7',
    },
    activeCategoryChip: {
        backgroundColor: '#007AFF',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
    },
    activeCategoryText: {
        color: 'white',
    },
    listContent: {
        padding: 20,
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#8E8E93',
        fontSize: 16,
    },
});
