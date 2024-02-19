import api from "./api";

const TransactionsService = {
  getTransactions: async () => {
    try {
      const response = await api.get("/transactions");
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
  addTransaction: async (transaction: any) => {
    const response = await api.post("/transactions", transaction);
    return response.data;
  },
};

export default TransactionsService;
