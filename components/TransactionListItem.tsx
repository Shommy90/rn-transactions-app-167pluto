import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { convertToMoney } from "@/utils/money-converter";
import { Transaction } from "@/types/Transaction";

interface TransactionListItemProps {
  item: Transaction;
  setItemHeight: (height: number) => void;
}

const TransactionListItem: FC<TransactionListItemProps> = ({
  item,
  setItemHeight,
}) => {
  console.log("item", item);
  return (
    <View
      style={styles.transactionItem}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setItemHeight(height);
      }}
    >
      <View style={styles.amountContainer}>
        <MaterialCommunityIcons
          name="transfer"
          size={26}
          color={`${Colors.palette.green}90`}
        />
        <Text style={styles.transactionTextAmount}>
          ${convertToMoney(item.value)}
        </Text>
      </View>
      <Text style={styles.transactionTextDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionTextAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#444",
    marginLeft: 10,
  },
  transactionTextDate: {
    fontSize: 12,
    color: "gray",
  },
});

export default TransactionListItem;
