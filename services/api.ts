import axios from "axios";
import { Platform } from "react-native";

const apiURL =
  Platform.OS === "android"
    ? process.env.EXPO_PUBLIC_API_URL_ANDROID
    : process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
