import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { setAttendanceLocation, getOffices } from '../../api';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

export default function SetAttendanceLocation() {
    const router = useRouter();
    const [officeId, setOfficeId] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [offices, setOffices] = useState([]);

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

    const handleSetLocation = async () => {
        try {
            await setAttendanceLocation(officeId, parseFloat(latitude), parseFloat(longitude));
            Alert.alert('Success', 'Attendance location set successfully');
            router.back();
        } catch (error) {
            console.error('Error setting attendance location:', error);
            Alert.alert('Error', 'Failed to set attendance location');
        }
    };

    return (
        <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Set Attendance Location</Text>
                <Picker
                    selectedValue={officeId}
                    style={styles.picker}
                    onValueChange={(itemValue) => setOfficeId(itemValue)}
                >
                    {offices.map((office) => (
                        <Picker.Item key={office._id} label={office.name} value={office._id} />
                    ))}
                </Picker>
                <TextInput
                    style={styles.input}
                    placeholder='Latitude'
                    placeholderTextColor="#aaa"
                    value={latitude}
                    onChangeText={setLatitude}
                    keyboardType='numeric'
                />
                <TextInput
                    style={styles.input}
                    placeholder='Longitude'
                    placeholderTextColor="#aaa"
                    value={longitude}
                    onChangeText={setLongitude}
                    keyboardType='numeric'
                />
                <TouchableOpacity style={styles.button} onPress={handleSetLocation}>
                    <Text style={styles.buttonText}>Set Location</Text>
                </TouchableOpacity>
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
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
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
});
