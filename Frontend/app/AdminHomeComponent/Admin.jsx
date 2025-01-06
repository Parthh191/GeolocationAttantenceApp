import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Admin() {
  const router = useRouter();

  const navigateTo = (path) => {
    router.push(path);
  }

  const buttons = [
    { path: '/AdminHomeComponent/CreateOffices', image: require('../../assets/images/office.png'), text: 'Create Offices' },
    { path: '/AdminHomeComponent/CreateEmployees', image: require('../../assets/images/employee.png'), text: 'Create Employees' },
    { path: '/AdminHomeComponent/CheckOfficess', image: require('../../assets/images/office.png'), text: 'Check Offices' },
    { path: '/AdminHomeComponent/CheckEmployees', image: require('../../assets/images/employee.png'), text: 'Check Employees' },
    { path: '/AdminHomeComponent/SetAttendanceLocation', image: require('../../assets/images/location.png'), text: 'Set Attendance Location' }, // New button
    { path: '/AdminHomeComponent/ViewAttendanceLocation', image: require('../../assets/images/location.png'), text: 'View Attendance Location' }, // New button
  ];

  return (
    <LinearGradient
      colors={[500,'skyblue', 'black']}
      style={styles.container}
    >
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
  )
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
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '45%', // Adjust based on the number of columns
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
})