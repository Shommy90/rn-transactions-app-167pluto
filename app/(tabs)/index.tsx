import {
  Button,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";

export default function CreateScreen() {
  const [amount, setAmount] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await axios.get("http://localhost:3000/fees");
        setFees(response.data);
      } catch (error) {
        console.error("Error fetching fees:", error);
      }
    };

    fetchFees();
  }, []);

  const handleProceed = async () => {
    const transaction = {
      value: parseFloat(amount),
      createdAt: Date.now(),
    };

    try {
      await axios.post("http://localhost:3000/transactions", transaction);

      setAmount("");
      alert("Transaction successful!");
    } catch (error) {
      console.error("Error adding transaction:", error);
      alert("Something went wrong.");
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleStoreTransaction = async () => {
    try {
      const id = Date.now().toString();
      const newTransaction = {
        id,
        value: parseFloat(amount),
        createdAt: new Date().toISOString(),
      };
      const existingTransactionsString = await AsyncStorage.getItem(
        "transactions"
      );
      const existingTransactions = existingTransactionsString
        ? JSON.parse(existingTransactionsString)
        : [];
      const updatedTransactions = [...existingTransactions, newTransaction];

      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );

      setAmount("");
      alert("Transaction stored for later!");
    } catch (error) {
      console.error("Error storing transaction:", error);
      alert("Failed to store the transaction. Please try again.");
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleOpenModal = () => {
    const total = calculateTotalDeduction(amount, fees);
    setTotalDeduction(total);
    setIsModalVisible(true);
  };

  const calculateTotalDeduction = (amount: string, fees: any[]) => {
    fees.sort((a, b) => b.minValue - a.minValue);

    const applicableFee = fees.find((fee) => amount >= fee.minValue)?.fee || 0;
    const totalAmount = parseFloat(amount) + parseFloat(applicableFee);

    return totalAmount;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Transaction</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Transaction Amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setAmount("")}
          >
            <AntDesign name="close" size={16} color="#979797" />
          </TouchableOpacity>
        </View>

        <Button
          title="Submit Transaction"
          onPress={handleOpenModal}
          disabled={amount === ""}
        />
      </View>

      <View />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
        style={styles.modalContainer}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => setIsModalVisible(false)}
            >
              <FontAwesome size={20} name="close" />
            </TouchableOpacity>

            <Text style={styles.modalText}>
              Total Deduction: {totalDeduction.toFixed(2)}
            </Text>
            <Button title="Proceed" onPress={handleProceed} />
            <Button title="Store for Later" onPress={handleStoreTransaction} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: "#979797",
    borderWidth: 1,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255, 0.3)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  close: {
    padding: 5,
    position: "absolute",
    right: 10,
    top: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  clearButton: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 5,
    top: 0,
    bottom: 0,
    paddingHorizontal: 10,
    borderTopEndRadius: 10,
    borderBottomEndRadius: 10,
  },
});
