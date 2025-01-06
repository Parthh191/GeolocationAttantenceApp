import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getOffices, getAttendanceLocation } from '../../api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function ViewAttendanceLocation() {
    const router = useRouter();
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [location, setLocation] = useState(null);

    useEffect(() => {
        const fetchOffices = async () => {
            try {
                const officesData = await getOffices();
                setOffices(officesData);
            } catch (error) {
                console.error('Error fetching offices:', error);
            }
        };

        fetchOffices();
    }, []);

    const handleFetchLocation = async () => {
        if (!selectedOffice) {
            Alert.alert('Error', 'Please select an office');
            return;
        }
        try {
            const locationData = await getAttendanceLocation(selectedOffice);
            setLocation(locationData);
        } catch (error) {
            console.error('Error fetching attendance location:', error);
            if (error.response && error.response.status === 404) {
                Alert.alert('Error', 'Attendance location not found');
            } else {
                Alert.alert('Error', 'Failed to fetch attendance location');
            }
        }
    };

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>View Attendance Location</Text>
                <Picker
                    selectedValue={selectedOffice}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedOffice(itemValue)}
                >
                    {offices.map((office) => (
                        <Picker.Item key={office._id} label={office.name} value={office._id} />
                    ))}
                </Picker>
                <TouchableOpacity style={styles.button} onPress={handleFetchLocation}>
                    <Text style={styles.buttonText}>Fetch Location</Text>
                </TouchableOpacity>
                {location && (
                    <View style={styles.locationContainer}>
                        <Text style={styles.locationText}>Latitude: {location.latitude}</Text>
                        <Text style={styles.locationText}>Longitude: {location.longitude}</Text>
                    </View>
                )}
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        marginTop: -20,
    },
    innerContainer: {
        width: '90%',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        color: '#333',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#3b5998',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationContainer: {
        marginTop: 20,
    },
    locationText: {
        fontSize: 16,
        color: '#333',
        marginBottom: 10,
    },
});
