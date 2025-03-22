import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type OnboardingContextType = {
  hasCompletedOnboarding: boolean;
  isOnboardingLoading: boolean;
  setOnboardingComplete: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
};

const OnboardingContext = createContext<OnboardingContextType>({
  hasCompletedOnboarding: false,
  isOnboardingLoading: true,
  setOnboardingComplete: async () => {},
  resetOnboarding: async () => {},
});

// Use the same key as in your existing code
const ONBOARDING_KEY = "hasSeenOnboarding";

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  async function checkOnboardingStatus() {
    try {
      setIsOnboardingLoading(true);
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(value === "true");
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    } finally {
      setIsOnboardingLoading(false);
    }
  }

  async function setOnboardingComplete() {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error("Error setting onboarding complete:", error);
    }
  }

  async function resetOnboarding() {
    try {
      await AsyncStorage.removeItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(false);
    } catch (error) {
      console.error("Error resetting onboarding:", error);
    }
  }

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        isOnboardingLoading,
        setOnboardingComplete,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => useContext(OnboardingContext);
