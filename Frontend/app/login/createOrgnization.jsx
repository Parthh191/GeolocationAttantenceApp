import { ScrollView, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import { createOrganization } from '../../api'
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { TextInput } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function createOrgnization() {
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const router = useRouter();

  const handleCreateOrganization = async () => {
    // Validate input fields
    if (!name) {
      setError("Organization Name is required");
      return;
    }
    if (!key) {
      setError("Organization Key is required");
      return;
    }
    if (!address) {
      setError("Organization Address is required");
      return;
    }
    if (!phone) {
      setError("Organization Phone Number is required");
      return;
    }
    if (!email) {
      setError("Organization Email is required");
      return;
    }

    try {
      const organizationData = { name, key, address, phone, email };
      const res = await createOrganization(organizationData);
      setResponse(res);
      router.push('/login/CreateAdmin'); // Redirect to home screen after creating organization
      console.log("Organization created successfully:", res);
    } catch (error) {
      console.error('Error creating organization:', error.response?.data || error); // Improved debugging
      const errorMessage = error.response?.data?.error || error.message;
      const formattedError = typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage, null, 2);
      setError(formattedError);
    }
  }

  const handleInputChange = (setter) => (value) => {
    setter(value);
    setError(""); // Clear error when user starts typing
  }

  const handleSigin = () => {
    router.push('/login/login');
  }
  const handleCreateAccount = () => {
    router.push('/login/CreateAdmin');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput style={[styles.input, error && !name && styles.inputError]} placeholder="Organization Name" value={name} onChangeText={handleInputChange(setName)} />
      <TextInput secureTextEntry style={[styles.input, error && !key && styles.inputError]} placeholder="Organization Key" value={key} onChangeText={handleInputChange(setKey)} />
      <TextInput style={[styles.input, error && !address && styles.inputError]} placeholder="Organization Address" value={address} onChangeText={handleInputChange(setAddress)} />
      <TextInput style={[styles.input, error && !phone && styles.inputError]} placeholder="Organization Phone Number" value={phone} onChangeText={handleInputChange(setPhone)} />
      <TextInput style={[styles.input, error && !email && styles.inputError]} placeholder="Organization Email" value={email} onChangeText={handleInputChange(setEmail)} />
      <Text onPress={handleCreateOrganization} style={styles.btn}>Create</Text>
      <Text style={styles.text}>Have an account?{" "}<Text style={styles.sigin} onPress={handleSigin}>Login</Text></Text>
      <Text style={styles.text}>Have an Organization?{" "}<Text style={styles.sigin} onPress={handleCreateAccount}>Create Account</Text></Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: 'white',
    fontSize: 20,
    fontWeight: 'medium',
    marginBottom: 10,
    backgroundColor: '#4285F4',
    textAlign: 'center',
    padding: 10,
  },
  text:{
    color:'white',
    fontSize:15,
  }
  ,
  sigin:{
    color:'skyblue',
    fontSize:15,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
})