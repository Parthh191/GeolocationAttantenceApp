import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { getName, markAttendance } from '../../api'; // Assuming you have an API function to get the employee's name

export default function Employee() {
    const router = useRouter();
    const [employeeName, setEmployeeName] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        const fetchEmployeeName = async () => {
            try {
                const name = await getName();
                setEmployeeName(name);
            } catch (error) {
                console.error('Error fetching employee name:', error);
            }
        };

        const requestLocationPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                setErrorMsg('Permission to access background location was denied');
                return;
            }

            await Location.startLocationUpdatesAsync('background-location-task', {
                accuracy: Location.Accuracy.High,
                timeInterval: 10000, // Update every 10 seconds
                distanceInterval: 10, // Update every 10 meters
                showsBackgroundLocationIndicator: true,
            });

            Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 10000, // Update every 10 seconds
                    distanceInterval: 10, // Update every 10 meters
                },
                async (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    if (!latitude || !longitude) {
                        console.error('Invalid location data:', { latitude, longitude });
                        return;
                    }

                    try {
                        await markAttendance(latitude, longitude);
                        console.log('Attendance marked successfully');
                    } catch (error) {
                        console.error('Error marking attendance:', error);
                        if (error.response && error.response.status === 404) {
                            Alert.alert('Error', 'Attendance endpoint not found');
                        } else {
                            Alert.alert('Error', 'Failed to mark attendance');
                        }
                    }
                }
            );
        };

        fetchEmployeeName();
        requestLocationPermissions();
    }, []);

    const navigateTo = (path) => {
        router.push(path);
    }

    const buttons = [
        { path: '/EmployeeHomeComponent/ViewAttendance', image: require('../../assets/images/attendence.png'), text: 'View Attendance' },
        { path: '/EmployeeHomeComponent/ViewAttendanceAverage', image: require('../../assets/images/average.png'), text: 'View Attendance Average' },
    ];

    return (
        <LinearGradient
            colors={['skyblue', 'black']}
            style={styles.container}
        >
            <Text style={styles.welcomeText}>Welcome, {employeeName}</Text>
            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
            {buttons.map((button, index) => (
                <TouchableOpacity key={index} onPress={() => navigateTo(button.path)} style={styles.gridItem}>
                    <LinearGradient
                        colors={['#4285F4', '#34A853']}
                        style={styles.gradient}
                    >
                        <Image source={button.image} style={styles.image} />
                        <Text style={styles.btnText}>{button.text}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            ))}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        alignContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    welcomeText: {
        width: '100%',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        marginBottom: 20,
    },
    gridItem: {
        width: '45%',
        marginVertical: 10,
        aspectRatio: 0.8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        width: '100%',
        height: '100%',
    },
    btnText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginTop: 10,
        textAlign: 'center',
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
});