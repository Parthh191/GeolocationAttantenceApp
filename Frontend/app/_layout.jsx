import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';
import startScreen from './login/startScreen';

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        console.log("Token retrieved:", token); // Debugging line
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error retrieving token:", error); // Debugging line
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []); // Add an empty dependency array here

  useEffect(() => {
    if (isLoggedIn === false) {
      router.replace('/login/startScreen');
    }
  }, [isLoggedIn]);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="login/startScreen" options={{ headerShown: false }} />
        )}
      </Stack>
    </View>
  );
}
