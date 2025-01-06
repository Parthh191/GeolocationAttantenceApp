import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getAttendanceAverage } from '../../api';

export default function ViewAttendanceAverage() {
    const [attendanceAverage, setAttendanceAverage] = useState(null);

    useEffect(() => {
        const fetchAttendanceAverage = async () => {
            try {
                const averageData = await getAttendanceAverage();
                setAttendanceAverage(averageData.average);
            } catch (error) {
                console.error('Error fetching attendance average:', error);
                Alert.alert('Error', 'Failed to fetch attendance average');
            }
        };

        fetchAttendanceAverage();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Attendance Average</Text>
            {attendanceAverage !== null ? (
                <Text style={styles.average}>{attendanceAverage}%</Text>
            ) : (
                <Text>Loading...</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    average: {
        fontSize: 20,
        fontWeight: '600',
    },
});
