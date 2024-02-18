import { StyleSheet, Button } from "react-native";
import { Text, View } from "@/components/Themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import axios from "axios";

export default function PendingScreen() {
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
  const [itemHeight, setItemHeight] = useState(0);

  const fetchStoredTransactions = async () => {
    try {
      const storedTransactionsString = await AsyncStorage.getItem(
        "transactions"
      );
      const storedTransactions = storedTransactionsString
        ? JSON.parse(storedTransactionsString)
        : [];

      setPendingTransactions(storedTransactions);
    } catch (error) {
      console.error("Failed to fetch stored transactions:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStoredTransactions();
    }, [])
  );

  const renderItem = ({ item }: any) => (
    <View
      style={styles.transactionItem}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        if (itemHeight === 0) {
          setItemHeight(height);
        }
      }}
    >
      <Text style={styles.transactionAmount}>
        Amount: $ {item.value.toFixed(2)}
      </Text>
      <View style={styles.buttonsContainer}>
        <Button
          title="Accept"
          onPress={() => handleAccept(item.id)}
          color="#5cb85c"
        />
        <Button
          title="Decline"
          onPress={() => handleDecline(item.id)}
          color="#d9534f"
        />
      </View>
    </View>
  );

  const handleDecline = async (transactionId: string, ifAccepted?: boolean) => {
    try {
      const transactionsString = await AsyncStorage.getItem("transactions");
      const transactions = transactionsString
        ? JSON.parse(transactionsString)
        : [];
      const updatedTransactions = transactions.filter(
        (transaction: any) => transaction.id !== transactionId
      );

      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );

      setPendingTransactions(updatedTransactions);
      !ifAccepted && alert("Transaction declined and removed.");
    } catch (error) {
      console.error("Error declining transaction:", error);
      alert("Failed to decline transaction. Please try again.");
    }
  };

  const handleAccept = async (transactionId: string) => {
    const transaction = pendingTransactions.find(
      (item) => item.id === transactionId
    );

    try {
      await axios.post("http://localhost:3000/transactions", transaction);
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
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
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

  transactionItem: {
    backgroundColor: "#fff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  transactionAmount: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
