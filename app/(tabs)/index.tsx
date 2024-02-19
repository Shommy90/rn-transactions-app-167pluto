import {
  Button,
  Modal,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import FeesService from "../../services/fees";
import TransactionsService from "../../services/transactions";
import StorageService from "../../services/storage";
import ButtonComponent from "@/components/ButtonComponent";
import { calculateTotalDeduction } from "../../utils/deduction";
import Colors from "@/constants/Colors";

export default function CreateScreen() {
  const [amount, setAmount] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [totalDeduction, setTotalDeduction] = useState(0);
  const [fees, setFees] = useState([]);
  const [currentFee, setCurrentFee] = useState(0);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const feesData = await FeesService.getFees();

        setFees(feesData);
      } catch (error) {
        console.error("Error fetching fees:", error);
      }
    };

    fetchFees();
  }, []);

  const handleProceed = async () => {
    const transaction = {
      id: Date.now().toString(),
      value: parseFloat(amount),
      createdAt: Date.now(),
    };

    try {
      await TransactionsService.addTransaction(transaction);

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

      const existingTransactions = await StorageService.getItem("transactions");
      let updatedTransactions: any[] = [];

      if (existingTransactions) {
        updatedTransactions = [...existingTransactions, newTransaction];
      } else {
        updatedTransactions = [newTransaction];
      }

      await StorageService.storeItem("transactions", updatedTransactions);

      setAmount("");
      alert("Transaction stored for later!");
    } catch (error) {
      console.error("Error storing transaction:", error);
      alert("Failed to store the transaction. Please try again.");
    } finally {
      setIsModalVisible(false);
    }
  };

  const handleSubmit = () => {
    if (!Number(amount)) {
      alert("Input must be number!");
      return;
    }

    const totalAmount = calculateTotalDeduction(amount, fees).totalAmount;
    const calcCurrentFee = calculateTotalDeduction(amount, fees).applicableFee;
    setTotalDeduction(totalAmount);
    setCurrentFee(calcCurrentFee);
    setIsModalVisible(true);
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

        <ButtonComponent
          title="Submit"
          onPress={handleSubmit}
          disabled={amount === ""}
        />
      </View>

      <View />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.close}
              onPress={() => setIsModalVisible(false)}
            >
              <AntDesign name="close" size={20} color="#979797" />
            </TouchableOpacity>

            <View>
              <Text style={styles.modalTextAmount}>
                Total Amount:{" "}
                <Text style={styles.textHighLight}>
                  {totalDeduction.toFixed(2)}
                </Text>
              </Text>
              <Text style={styles.modalTextFee}>Fee: {currentFee}</Text>
            </View>

            <View style={styles.buttonsContainer}>
              <View style={styles.btnContainer}>
                <ButtonComponent
                  title="Store"
                  onPress={handleStoreTransaction}
                  textStyle={styles.btnText}
                  btnStyle={styles.btnStyle}
                />
              </View>
              <View style={styles.btnContainer}>
                <ButtonComponent
                  title="Proceed"
                  onPress={handleProceed}
                  textStyle={styles.btnText}
                  btnStyle={styles.btnStyle}
                  color={Colors.palette.green}
                />
              </View>
            </View>
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
    backgroundColor: "rgba(255,255,255, 0.8)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
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
  modalTextAmount: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalTextFee: {
    fontSize: 12,
    opacity: 0.7,
    color: Colors.palette.red,
  },
  textHighLight: {
    fontWeight: "bold",
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
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 40,
  },
  btnContainer: {
    flex: 1,
  },
  btnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  btnStyle: {
    paddingVertical: 8,
    marginHorizontal: 10,
  },
});
