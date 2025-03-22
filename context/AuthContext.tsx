import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerUser, loginUser, getUserProfile } from "@/utils/auth";

// Define types based on your API responses
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: { name: string };
  // Add other user properties as needed
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  refreshUserProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on app start
    checkUserSession();
  }, []);

  async function checkUserSession() {
    try {
      setIsLoading(true);
      // Check if we have a token
      const token = await AsyncStorage.getItem("userToken");

      if (token) {
        // If we have a token, fetch the user profile
        const userData = await getUserProfile();
        setUser(userData);
        // console.log("userData", userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      // If there's an error (like an expired token), clear the token
      await AsyncStorage.removeItem("userToken");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true);
      // Use the loginUser function from your auth.ts
      const response = await loginUser(email, password);

      // Fetch user profile after successful login
      const userData = await getUserProfile();
      setUser(userData);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signUp(userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
  }) {
    try {
      setIsLoading(true);
      // Use the registerUser function from your auth.ts
      const response = await registerUser({
        ...userData,
        role: { name: "user" },
      });

      // After registration, automatically sign in
      await signIn(userData.email, userData.password);

      return response;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    try {
      setIsLoading(true);
      // Clear the token from storage
      await AsyncStorage.removeItem("userToken");
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function refreshUserProfile() {
    try {
      setIsLoading(true);
      const userData = await getUserProfile();
      setUser(userData);
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      // If there's an error fetching the profile, the token might be invalid
      await signOut();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        signIn,
        signUp,
        signOut,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
