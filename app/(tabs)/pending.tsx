import { StyleSheet, Button } from "react-native";
import { Text, View } from "@/components/Themed";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import StorageService from "../../services/storage";
import TransactionsService from "../../services/transactions";
import ButtonComponent from "@/components/ButtonComponent";
import Colors from "@/constants/Colors";
import { convertToMoney } from "@/utils/money-converter";

export default function PendingScreen() {
  const [pendingTransactions, setPendingTransactions] = useState<any[]>([]);
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
        (transaction: any) => transaction.id !== transactionId
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
      (item) => item.id === transactionId
    );

    try {
      await TransactionsService.addTransaction(transaction);
      await handleDecline(transactionId, true);

      alert("Transaction accepted and removed from pending list.");
    } catch (error) {
      console.error("Error accepting transaction:", error);
      alert("Failed to accept transaction. Please try again.");
    }
  };

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
      <View style={styles.amountContainer}>
        <Text style={styles.transactionAmount}>
          ${convertToMoney(item.value)}
        </Text>
        <Text style={styles.transactionDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <ButtonComponent
          title="Decline"
          onPress={() => handleDecline(item.id)}
          color={Colors.palette.red}
          btnStyle={styles.btnStyle}
          textStyle={styles.btnText}
        />
        <View style={styles.btnSeparator} />
        <ButtonComponent
          title="Accept"
          onPress={() => handleAccept(item.id)}
          color={Colors.palette.green}
          btnStyle={styles.btnStyle}
          textStyle={styles.btnText}
        />
      </View>
    </View>
  );

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
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountContainer: {},
  transactionAmount: {
    fontSize: 16,
    marginBottom: 3,
  },
  transactionDate: {
    fontSize: 12,
    color: "gray",
  },
  btnStyle: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  btnText: {
    fontSize: 12,
  },
  btnSeparator: {
    marginHorizontal: 8,
  },
});
