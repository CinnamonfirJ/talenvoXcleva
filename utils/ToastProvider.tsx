import React from "react";
import Toast, {
  BaseToast,
  ToastConfig,
  ToastShowParams,
} from "react-native-toast-message";

// Custom Toast Config
const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "green" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
    />
  ),
  error: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "red" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: "600" }}
    />
  ),
};

// Function to Show Toasts
export const showToast = (
  type: "success" | "error",
  title: string,
  message: string
) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: "top",
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 50,
  } as ToastShowParams);
};

export default function ToastProvider({ children }: any) {
  return (
    <>
      <Toast config={toastConfig} />
      {children}
    </>
  );
}
