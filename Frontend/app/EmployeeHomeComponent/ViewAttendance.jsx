import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput, Button } from 'react-native';
import { getAttendance } from '../../api';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

export default function ViewAttendance() {
    const [attendance, setAttendance] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const data = await getAttendance();
                setAttendance(data);
                setFilteredAttendance(data);
            } catch (error) {
                console.error('Error fetching attendance:', error);
                Alert.alert('Error', 'Failed to fetch attendance');
            }
        };

        fetchAttendance();
    }, []);

    const handleFilter = () => {
        if (filterDate) {
            const filtered = attendance.filter(day => new Date(day.date).toLocaleDateString() === new Date(filterDate).toLocaleDateString());
            setFilteredAttendance(filtered);
        } else {
            setFilteredAttendance(attendance);
        }
    };

    const formatDuration = (checkIn, updatedAt) => {
        const duration = new Date(updatedAt) - new Date(checkIn);
        const hours = Math.floor(duration / (1000 * 60 * 60));
        const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h ${minutes}m`;
    };

    return (
        <LinearGradient
            colors={['skyblue', 'black']}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Attendance Records</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter date (YYYY-MM-DD)"
                    value={filterDate}
                    onChangeText={setFilterDate}
                />
                <Button title="Filter" onPress={handleFilter} />
                {filteredAttendance.length > 0 ? (
                    <View>
                        <LineChart
                            data={{
                                labels: filteredAttendance.map(day => new Date(day.date).toLocaleDateString()),
                                datasets: [{ data: filteredAttendance.map(day => day.checkOut ? (new Date(day.checkOut) - new Date(day.checkIn)) / (1000 * 60 * 60) : 0) }],
                            }}
                            width={320}
                            height={220}
                            chartConfig={{
                                backgroundColor: '#e26a00',
                                backgroundGradientFrom: '#fb8c00',
                                backgroundGradientTo: '#ffa726',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                style: { borderRadius: 16 },
                                propsForDots: { r: '6', strokeWidth: '2', stroke: '#ffa726' },
                            }}
                            style={{ marginVertical: 8, borderRadius: 16 }}
                        />
                        {filteredAttendance.map((day, index) => (
                            <View key={index} style={styles.record}>
                                <Text>{new Date(day.date).toLocaleDateString()}: {day.updatedAt ? formatDuration(day.checkIn, day.updatedAt) : '0h 0m'}</Text>
                            </View>
                        ))}
                    </View>
                ) : (
                    <Text>No attendance records found.</Text>
                )}
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: 'white',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        width: '80%',
        backgroundColor: 'white',
    },
    record: {
        marginVertical: 8,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
});
