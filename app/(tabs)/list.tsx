import { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Text, View } from "@/components/Themed";
import { FlashList } from "@shopify/flash-list";
import TransactionsService from "../../services/transactions";

export default function ListScreen() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [itemHeight, setItemHeight] = useState(0);

  const fetchTransactions = async () => {
    try {
      const transactionsData = await TransactionsService.getTransactions();

      transactionsData.sort((a: any, b: any) => {
        const dateA: any = new Date(a.createdAt);
        const dateB: any = new Date(b.createdAt);
        return dateB - dateA;
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
      <Text style={styles.transactionText}>Amount: ${item.value}</Text>
      <Text style={styles.transactionText}>
        Date: {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={transactions}
        renderItem={renderItem}
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
  transactionItem: {
    padding: 20,
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.23,
    shadowRadius: 6,
    elevation: 4,
  },
  transactionText: {
    fontSize: 16,
  },
});
