import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageService = {
  storeItem: async (key: any, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Error storing ${key}:`, error);
    }
  },
  getItem: async (key: any) => {
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
