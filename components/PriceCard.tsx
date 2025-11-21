import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MarketItem } from '../data/mockData';

interface PriceCardProps {
    item: MarketItem;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

export const PriceCard: React.FC<PriceCardProps> = ({ item, isFavorite, onToggleFavorite }) => {
    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return 'arrow-up';
            case 'down': return 'arrow-down';
            default: return 'remove';
        }
    };

    const getTrendColor = (trend: string) => {
        switch (trend) {
            case 'up': return '#FF3B30'; // Red for price increase
            case 'down': return '#34C759'; // Green for price decrease (good for buyer)
            default: return '#8E8E93';
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.category}>{item.category} • {item.unit}</Text>
                </View>
                <TouchableOpacity onPress={onToggleFavorite}>
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? "#FF2D55" : "#C7C7CC"}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.priceContainer}>
                <View style={styles.priceBlock}>
                    <Text style={styles.priceLabel}>En Düşük</Text>
                    <Text style={styles.priceValue}>{item.lowPrice} ₺</Text>
                </View>

                <View style={[styles.priceBlock, styles.mainPriceBlock]}>
                    <Text style={styles.mainPriceLabel}>Ortalama</Text>
                    <Text style={styles.mainPriceValue}>{item.avgPrice} ₺</Text>
                    <View style={styles.trendContainer}>
                        <Ionicons name={getTrendIcon(item.trend)} size={16} color={getTrendColor(item.trend)} />
                    </View>
                </View>

                <View style={styles.priceBlock}>
                    <Text style={styles.priceLabel}>En Yüksek</Text>
                    <Text style={styles.priceValue}>{item.highPrice} ₺</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    category: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500',
    },
    priceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 12,
    },
    priceBlock: {
        alignItems: 'center',
        flex: 1,
    },
    mainPriceBlock: {
        flex: 1.2,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#E5E5EA',
    },
    priceLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#3A3A3C',
    },
    mainPriceLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 4,
        fontWeight: '600',
    },
    mainPriceValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#007AFF',
    },
    trendContainer: {
        position: 'absolute',
        right: 8,
        top: 8,
    },
});
