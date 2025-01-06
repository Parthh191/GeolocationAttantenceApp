import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRole } from '../../api';
import { useRouter } from 'expo-router';
import Admin from '../AdminHomeComponent/Admin';
import Employee from '../EmployeeHomeComponent/Employee';
export default function HomeScreen() {
  const [userType, setUserType] = useState('');
  const router = useRouter();

  useEffect(() => {
    const getUserType = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const decodedToken = await getUserRole(token);
          setUserType(decodedToken.userType);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    getUserType();
  }, []);



  return (
    <View style={{ flex: 1,  margin: 0 }}>
      {userType ? (userType=="admin")?<Admin/> :<Employee/>: <Text>Loading...</Text>}
    </View>
  );
}
