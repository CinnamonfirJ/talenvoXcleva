import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://talenvo-hackaton-be.onrender.com/api/v1";

export const registerUser = async (userData: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: { name: string };
}) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userData,
        role: { name: "user" },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message?.message || "Signup failed");
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    // console.log(data.data?.role);

    if (!response.ok) {
      throw new Error(data?.error?.message?.message || "Login failed");
    }

    // Store user token in AsyncStorage
    await AsyncStorage.setItem("userToken", data?.data?.access_token);

    return data;
  } catch (error) {
    throw error;
  }
};

// Fetch Current User Profile
export const getUserProfile = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch user profile");
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};
