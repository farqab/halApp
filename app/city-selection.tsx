import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMarket } from '../context/MarketContext';

export default function CitySelectionScreen() {
    const router = useRouter();
    const { selectedCity, setCity, setDistrict, marketData } = useMarket();

    // Fallback to empty arrays if data isn't loaded yet
    const cities = marketData?.cities || [];
    const districts = marketData?.districts || [];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Konum Değiştir</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#1C1C1E" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {/* Cities Column */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>Şehir</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {cities.map((city: any) => (
                            <TouchableOpacity
                                key={city.id}
                                style={[
                                    styles.item,
                                    selectedCity?.id === city.id && styles.selectedItem
                                ]}
                                onPress={() => setCity(city)}
                            >
                                <Text style={[
                                    styles.itemText,
                                    selectedCity?.id === city.id && styles.selectedItemText
                                ]}>
                                    {city.name}
                                </Text>
                                {selectedCity?.id === city.id && (
                                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={styles.separator} />

                {/* Districts Column */}
                <View style={styles.column}>
                    <Text style={styles.columnTitle}>Hal / İlçe</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {selectedCity ? (
                            districts.filter((d: any) => d.cityId === selectedCity.id).length > 0 ? (
                                districts.filter((d: any) => d.cityId === selectedCity.id).map((district: any) => (
                                    <TouchableOpacity
                                        key={district.id}
                                        style={styles.item}
                                        onPress={() => {
                                            setDistrict(district);
                                            router.back();
                                        }}
                                    >
                                        <Text style={styles.itemText}>{district.name}</Text>
                                        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>Bu şehirde kayıtlı hal bulunamadı.</Text>
                            )
                        ) : (
                            <Text style={styles.emptyText}>Önce şehir seçiniz.</Text>
                        )}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        padding: 20,
    },
    column: {
        flex: 1,
    },
    separator: {
        width: 1,
        backgroundColor: '#E5E5EA',
        marginHorizontal: 12,
    },
    columnTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    item: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    selectedItem: {
        backgroundColor: '#F2F2F7',
    },
    itemText: {
        fontSize: 16,
        color: '#1C1C1E',
    },
    selectedItemText: {
        color: '#007AFF',
        fontWeight: '600',
    },
    emptyText: {
        color: '#8E8E93',
        fontStyle: 'italic',
        marginTop: 20,
        textAlign: 'center',
    },
});
