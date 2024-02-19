import Colors from "@/constants/Colors";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent,
  TouchableOpacityProps,
} from "react-native";

type Props = TouchableOpacityProps & {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  color?: string;
  textColor?: string;
  textStyle?: any;
  btnStyle?: any;
};

const ButtonComponent: React.FC<Props> = ({
  title,
  onPress,
  color = Colors.palette.blue,
  textColor = Colors.palette.white,
  textStyle,
  btnStyle,
  ...touchableOpacityProps
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: color,
          opacity: touchableOpacityProps.disabled ? 0.5 : 1,
        },
        btnStyle,
      ]}
      activeOpacity={0.8}
      {...touchableOpacityProps}
    >
      <Text style={[styles.text, { color: textColor }, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ButtonComponent;
