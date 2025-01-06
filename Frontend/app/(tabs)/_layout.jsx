import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router'

export default function tabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'blue',
        tabBarStyle: { backgroundColor: 'rgb(0, 0, 0)' }, // Change navbar background color
        tabBarLabelStyle: { fontSize: 12}, // Change font size of tabBarLabel
      }}
    >
      <Tabs.Screen name='home'
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => 
            <FontAwesome name="home" size={30} color={color} />
        }}
      />
      <Tabs.Screen name='profile'
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => 
            <FontAwesome name="user"  size={30} color={color} />
        }}
      />
    </Tabs>
  )
}