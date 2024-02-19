import { Transaction } from "@/types/Transaction";
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageService = {
  storeItem: async (key: string, value: Transaction[]) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },
  getItem: async (key: string) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Error fetching ${key}:`, error);
      return null;
    }
  },
};

export default StorageService;
