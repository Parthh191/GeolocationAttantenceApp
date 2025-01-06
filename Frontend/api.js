import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your backend URL. If running on a physical device or emulator, use the actual IP address of your machine.
const API_URL = 'http://192.168.1.6:3000'; // Use 10.0.2.2 for Android emulator, localhost for iOS simulator, or your machine's IP address for physical devices

export const getAttendance = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/attendance`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance:', error);
        throw error;
    }
};

export const getAttendanceAverage = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(`${API_URL}/attendance/average`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching attendance average:', error);
        throw error;
    }
};

export const markAttendance = async (latitude, longitude) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await axios.post(`${API_URL}/markAttendance`, { latitude, longitude }, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error marking attendance:', error);
        throw error;
    }
};

export const login = async (username, password) => {
    try {
        console.log(`Attempting to log in with username: ${username}`); // Debugging line
        const response = await axios.post(`${API_URL}/login`, { username, password });
        return response.data;
    } catch (error) {
        console.error('Error logging in:', error.response?.data || error); // Improved debugging
        throw error;
    }
};

export const createOrganization = async (organizationData) => {
    try {
        const response = await axios.post(`${API_URL}/createOrganization`, organizationData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating organization:', error.response?.data || error); // Improved debugging
        throw error;
    }
};

export const createAdmin = async (adminData) => {
    try {
        const response = await axios.post(`${API_URL}/createAdmin`, adminData);
        return response.data;
    } catch (error) {
        console.error('Error creating admin:', error);
        throw error;
    }
};

export const getUserRole = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/getUserRole`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching user role:', error);
        throw error;
    }
};

export const createOffice = async (officeData) => {
    const token = await AsyncStorage.getItem('userToken'); // Assuming token is stored in localStorage for this example. Adjust as needed.
    try {
        const response = await axios.post(`${API_URL}/createOffice`, officeData, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating office:', error);
        throw error;
    }
};

export const createEmployee = async (employeeData) => {
    const token = await AsyncStorage.getItem('userToken'); // Assuming token is stored in localStorage for this example. Adjust as needed.
    try {
        const response = await axios.post(`${API_URL}/createEmployee`, employeeData, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating employee:', error);
        throw error;
    }
};

export const getOffices = async () => { // Corrected function name
    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await axios.get(`${API_URL}/getOffices`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching offices:', error);
        throw error;
    }
};

export const getOfficeInfo = async (data) => {
    const token = await AsyncStorage.getItem('userToken'); // Assuming token is stored in localStorage for this example. Adjust as needed.
    try {
        const response = await axios.get(`${API_URL}/getOfficeInfo`, data, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching office info:', error);
        throw error;
    }
};

export const getEmployees = async () => {
    const token = await AsyncStorage.getItem('userToken'); // Assuming token is stored in localStorage for this example. Adjust as needed.
    try {
        const response = await axios.get(`${API_URL}/getEmployees`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employee info:', error);
        throw error;
    }
};

export const getEmployeeInfo = async (data) => {
    const token = await AsyncStorage.getItem('userToken'); // Assuming token is stored in localStorage for this example. Adjust as needed.
    try {
        const response = await axios.get(`${API_URL}/getEmployeeInfo`, data, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching employee info:', error);
        throw error;
    }
};

export const setAttendanceLocation = async (officeId, latitude, longitude) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await axios.post(`${API_URL}/setAttendanceLocation`, { officeId, latitude, longitude }, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error setting attendance location:', error);
        throw error;
    }
};

export const getAttendanceLocation = async (officeId) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await axios.get(`${API_URL}/getAttendanceLocation/${officeId}`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error getting attendance location:', error);
        throw error;
    }
};

export const updateLocation = async (latitude, longitude) => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await axios.post(`${API_URL}/updateLocation`, { latitude, longitude }, {
            headers: {
                'Authorization': token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating location:', error);
        throw error;
    }
};

export const getName = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
        const response = await axios.get(`${API_URL}/getname`, {
            headers: {
                'Authorization': token
            }
        });
        return response.data.name;
    } catch (error) {
        console.error('Error fetching name:', error);
        throw error;
    }
};

// Export all functions as named exports
export default {
    getAttendance,
    getAttendanceAverage,
    markAttendance,
    login,
    createOrganization,
    createAdmin,
    getUserRole,
    createOffice,
    createEmployee,
    getOffices,
    getOfficeInfo,
    getEmployees,
    getEmployeeInfo,
    setAttendanceLocation,
    getAttendanceLocation,
    updateLocation,
    getName
};
