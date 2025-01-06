import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { createAdmin } from '../../api'
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

export default function CreateAdmin() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const router = useRouter();

  const handleCreateAdmin = async () => {
    // Validate input fields
    if (!name) {
      setError("Admin Name is required");
      return;
    }
    if (!username) {
      setError("Admin Username is required");
      return;
    }
    if (!password) {
      setError("Admin Password is required");
      return;
    }
    if (!address) {
      setError("Admin Address is required");
      return;
    }
    if (!phone) {
      setError("Admin Phone Number is required");
      return;
    }
    if (!email) {
      setError("Admin Email is required");
      return;
    }
    if (!organization) {
      setError("Organization Name is required");
      return;
    }
    if (!key) {
      setError("Organization Key is required");
      return;
    }

    try {
      const adminData = { name, username, password, address, phone, email, organization, key };
      const res = await createAdmin(adminData);
      setResponse(res);
      router.push('/login/login'); // Redirect to login screen after creating admin
      console.log("Admin created successfully:", res);
    } catch (error) {
      console.error('Error creating admin:', error.response?.data || error); // Improved debugging
      const errorMessage = error.response?.data?.error || error.message;
      const formattedError = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage, null, 2);
      setError(formattedError);
    }
  }

  const handleInputChange = (setter) => (value) => {
    setter(value);
    setError(""); // Clear error when user starts typing
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={[styles.input, error && !name && styles.inputError]} placeholder="Admin Name" placeholderTextColor="white" value={name} onChangeText={handleInputChange(setName)} />
      <TextInput style={[styles.input, error && !username && styles.inputError]} placeholder="Admin Username" placeholderTextColor="white" value={username} onChangeText={handleInputChange(setUsername)} />
      <View style={styles.passwordContainer}>
        <TextInput secureTextEntry={!showPassword} style={[styles.input, error && !password && styles.inputError, { flex: 1 }]} placeholder="Admin Password" placeholderTextColor="white" value={password} onChangeText={handleInputChange(setPassword)} />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Icon name={showPassword ? "eye-slash" : "eye"} style={{ marginLeft: -30, paddingBottom: 10 }} size={20} color="white" />
        </TouchableOpacity>
      </View>
      <TextInput style={[styles.input, error && !address && styles.inputError]} placeholder="Admin Address" placeholderTextColor="white" value={address} onChangeText={handleInputChange(setAddress)} />
      <TextInput style={[styles.input, error && !phone && styles.inputError]} placeholder="Admin Phone Number" placeholderTextColor="white" value={phone} onChangeText={handleInputChange(setPhone)} />
      <TextInput style={[styles.input, error && !email && styles.inputError]} placeholder="Admin Email" placeholderTextColor="white" value={email} onChangeText={handleInputChange(setEmail)} />
      <TextInput style={[styles.input, error && !organization && styles.inputError]} placeholder="Organization Name" placeholderTextColor="white" value={organization} onChangeText={handleInputChange(setOrganization)} />
      <View style={styles.passwordContainer}>
        <TextInput secureTextEntry={!showKey} style={[styles.input, error && !key && styles.inputError, { flex: 1 }]} placeholder="Organization Key" placeholderTextColor="white" value={key} onChangeText={handleInputChange(setKey)} />
        <TouchableOpacity onPress={() => setShowKey(!showKey)}>
          <Icon name={showKey ? "eye-slash" : "eye"} style={{ marginLeft: -30, paddingBottom: 10 }} size={20} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleCreateAdmin} style={styles.btn}>
        <Text style={styles.btnText}>Create</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(19, 18, 18, 0.98)',
  },
  input: {
    width: width * 0.8,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'gray',
    marginBottom: 15,
    paddingHorizontal: 10,
    color: 'white',
  },
  error: {
    color: 'red',
    marginBottom: 15,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    whiteSpace: 'pre-wrap', // Ensure the error message is displayed correctly
  },
  btn: {
    width: width * 0.8,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  btnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'medium',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.8,
    marginBottom: 15,
  },
  toggle: {
    color: 'skyblue',
    marginLeft: 10,
  }
})