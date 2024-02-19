import React, { FC } from "react";
import { View, Text, StyleSheet } from "react-native";
import ButtonComponent from "./ButtonComponent";
import Colors from "@/constants/Colors";
import { convertToMoney } from "@/utils/money-converter";
import { Transaction } from "@/types/Transaction";

interface PendingTransactionItemProps {
  item: Transaction;
  handleAccept: (id: string) => void;
  handleDecline: (id: string) => void;
  setItemHeight: (height: number) => void;
}

const PendingTransactionItem: FC<PendingTransactionItemProps> = ({
  item,
  handleAccept,
  handleDecline,
  setItemHeight,
}) => {
  return (
    <View
      style={styles.transactionItem}
      onLayout={(event) => {
        const { height } = event.nativeEvent.layout;
        setItemHeight(height);
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
};

const styles = StyleSheet.create({
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

export default PendingTransactionItem;
