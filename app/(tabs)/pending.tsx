import { StyleSheet, Button } from "react-native";
import { Text, View } from "@/components/Themed";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import StorageService from "../../services/storage";
import TransactionsService from "../../services/transactions";
import PendingTransactionItem from "@/components/PendingTransactionItem";
import { Transaction } from "@/types/Transaction";

export default function PendingScreen() {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [itemHeight, setItemHeight] = useState(0);

  const fetchStoredTransactions = async () => {
    try {
      const transactions = await StorageService.getItem("transactions");

      if (transactions) {
        setPendingTransactions(transactions);
      }
    } catch (error) {
      console.error("Failed to fetch stored transactions:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStoredTransactions();
    }, [])
  );

  const handleDecline = async (transactionId: string, ifAccepted?: boolean) => {
    try {
      const transactions = await StorageService.getItem("transactions");
      const updatedTransactions = transactions.filter(
        (transaction: Transaction) => transaction.id !== transactionId
      );

      await StorageService.storeItem("transactions", updatedTransactions);

      setPendingTransactions(updatedTransactions);
      !ifAccepted && alert("Transaction declined and removed.");
    } catch (error) {
      console.error("Error declining transaction:", error);
      alert("Failed to decline transaction. Please try again.");
    }
  };

  const handleAccept = async (transactionId: string) => {
    const transaction = pendingTransactions.find(
      (item: Transaction) => item.id === transactionId
    );

    if (!transaction) return;

    try {
      await TransactionsService.addTransaction(transaction);
      await handleDecline(transactionId, true);

      alert("Transaction accepted and removed from pending list.");
    } catch (error) {
      console.error("Error accepting transaction:", error);
      alert("Failed to accept transaction. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={pendingTransactions}
        renderItem={({ item }) => (
          <PendingTransactionItem
            item={item}
            handleAccept={handleAccept}
            handleDecline={handleDecline}
            setItemHeight={setItemHeight}
          />
        )}
        keyExtractor={(item: Transaction) => item.id}
        estimatedItemSize={itemHeight || 100}
        ListHeaderComponent={
          <Text style={styles.title}>Pending Transactions</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
});
