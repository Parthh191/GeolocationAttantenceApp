import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { login } from '../../api'; // Import the login function
import Icon from 'react-native-vector-icons/FontAwesome';

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      await AsyncStorage.setItem('userToken', response.token);
      console.log("Token set successfully:", response.token); // Debugging line
      router.push('/(tabs)/home');
    } catch (error) {
      console.error("Login error:", error.response?.data || error); // Improved debugging
      setError("Invalid credentials");
    }
  };

  const handleSignup = () => {
    router.push('/login/createOrgnization');
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={[styles.input, error && styles.inputError]}
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={[styles.input, error && styles.inputError, { flex: 1 }]}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
          <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="black" />
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Text title="LOGIN" onPress={handleLogin} style={styles.btn}>
        Login
      </Text>
      <Text style={styles.text}>Don't have an account?{" "}<Text style={styles.signup} onPress={handleSignup}>Create Account</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 30,
    backgroundColor: 'rgba(19, 18, 18, 0.98)',
  },
  input: {
    width: 200,
    height: 50,
    backgroundColor: 'gray',
    borderRadius: 10,
    textAlign: 'center',
    padding: 10,
    color: 'black',
    fontSize: 20,
    fontWeight: 'normal',
  },
  btn: {
    width: 200,
    height: 50,
    borderRadius: 10,
    color: 'white',
    fontSize: 20,
    fontWeight: 'medium',
    marginBottom: 10,
    backgroundColor: '#4285F4',
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
  },
  text: {
    color: 'white',
    fontSize: 15,
    marginTop: -30,
  },
  signup: {
    color: 'skyblue',
    fontSize: 15,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 200,
    backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    padding: 10,
  },
});