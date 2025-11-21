import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { City, District } from '../data/mockData';

interface CitySelectorProps {
    visible: boolean;
    onClose: () => void;
    cities: City[];
    districts: District[];
    onSelectCity: (city: City) => void;
    onSelectDistrict: (district: District) => void;
    selectedCity: City | null;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
    visible,
    onClose,
    cities,
    districts,
    onSelectCity,
    onSelectDistrict,
    selectedCity,
}) => {
    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Konum Seçin</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#1C1C1E" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        <View style={styles.column}>
                            <Text style={styles.columnTitle}>Şehir</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {cities.map((city) => (
                                    <TouchableOpacity
                                        key={city.id}
                                        style={[
                                            styles.item,
                                            selectedCity?.id === city.id && styles.selectedItem
                                        ]}
                                        onPress={() => onSelectCity(city)}
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

                        <View style={styles.column}>
                            <Text style={styles.columnTitle}>Hal / İlçe</Text>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {selectedCity ? (
                                    districts.length > 0 ? (
                                        districts.map((district) => (
                                            <TouchableOpacity
                                                key={district.id}
                                                style={styles.item}
                                                onPress={() => {
                                                    onSelectDistrict(district);
                                                    onClose();
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
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        height: '80%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 16,
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
    contentContainer: {
        flex: 1,
        flexDirection: 'row',
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
