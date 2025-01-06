import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { getOfficess } from '../../api';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function CheckOffices() {
  const router = useRouter();
  const [offices, setOffices] = React.useState([]);

  React.useEffect(() => {
    const fetchOffices = async () => {
      try {
        const response = await getOfficess();
        setOffices(response);
      } catch (error) {
        console.error('Error fetching offices:', error);
      }
    };

    fetchOffices();
  }, []);

  return (
    <LinearGradient
      colors={[500,'skyblue', 'black']}
      style={styles.container}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.header}>Offices</Text>
        {offices.map((office, index) => (
          <View key={index}>
            <LinearGradient
              colors={[500,'#4285F4', '#34A853']}
              style={styles.gradient}
            >
              <Text style={styles.officeName}>Office Name: {office.name}</Text>
              <Text style={styles.officeDetail}>Location: {office.address}</Text>
              <Text style={styles.officeDetail}>Phone Number: {office.phone}</Text>
              <Text style={styles.officeDetail}>Created At: {new Date(office.createdAt).toLocaleString()}</Text>
              <Text style={styles.officeDetail}>Updated At: {new Date(office.updatedAt).toLocaleString()}</Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  officeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  officeDetail: {
    fontSize: 14,
    marginBottom: 4,
    color: 'white',
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    width: '100%',
    padding: 10,
    marginBottom: 10,
  }
});