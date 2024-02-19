import api from "./api";

const FeesService = {
  getFees: async () => {
    try {
      const response = await api.get(`/fees`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
};

export default FeesService;
