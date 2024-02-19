import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import { FlashList } from "@shopify/flash-list";
import TransactionsService from "../../services/transactions";
import TransactionListItem from "@/components/TransactionListItem";
import { Transaction } from "@/types/Transaction";

export default function ListScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [itemHeight, setItemHeight] = useState(0);

  const fetchTransactions = async () => {
    try {
      const transactionsData = await TransactionsService.getTransactions();

      transactionsData.sort((a: Transaction, b: Transaction) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);

        return dateB.getTime() - dateA.getTime();
      });

      setTransactions(transactionsData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={transactions}
        renderItem={({ item }) => (
          <TransactionListItem item={item} setItemHeight={setItemHeight} />
        )}
        keyExtractor={(item) => item.id}
        estimatedItemSize={itemHeight || 100}
        ListHeaderComponent={
          <Text style={styles.title}>Transactions History</Text>
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
    marginBottom: 20,
    textAlign: "center",
  },
});
