import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { login } from '../../api'; // Import the login function

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      await AsyncStorage.setItem('userToken', response.token);
      console.log("Token set successfully:", response.token); // Debugging line
      router.replace("(tabs)");
    } catch (error) {
      console.error("Login error:", error.response?.data || error); // Improved debugging
      setError("Invalid credentials");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
