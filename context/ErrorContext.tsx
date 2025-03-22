import React, { createContext, useState, ReactNode, useContext } from "react";

// Define the structure of an error
interface ErrorType {
  message: string;
  code?: number;
}

// Define the context type
interface ErrorContextType {
  errors: ErrorType[];
  addError: (error: ErrorType) => void;
}

// Create the context with a default undefined value
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Define the props for the provider component
interface ErrorProviderProps {
  children: ReactNode;
}

// ErrorProvider component
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<ErrorType[]>([]);

  // Function to add an error
  const addError = (error: ErrorType) => {
    setErrors((prevErrors) => [...prevErrors, error]);
  };

  return (
    <ErrorContext.Provider value={{ errors, addError }}>
      {children}
    </ErrorContext.Provider>
  );
};

// Custom hook for using the context
export const useErrorContext = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorContext must be used within an ErrorProvider");
  }
  return context;
};

export default ErrorContext;
