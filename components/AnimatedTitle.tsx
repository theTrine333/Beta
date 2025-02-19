import { Colors } from "@/constants/Colors";
import { height, width } from "@/style";
import React, { useRef, useEffect } from "react";
import { Animated, Text, View, StyleSheet, useColorScheme } from "react-native";
const AnimatedText = ({ text }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    startAnimation();
  }, []);

  const startAnimation = () => {
    translateX.setValue(0);
    Animated.timing(translateX, {
      toValue: -1000,
      duration: 10000,
      useNativeDriver: true,
    }).start(() => {
      // Optional: Restart the animation when it finishes
      startAnimation();
    });
  };
  const theme = useColorScheme() ?? "light";
  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.text,
          {
            color: "white",

            transform: [{ translateX: translateX }],
          },
        ]}
        numberOfLines={1}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

export default AnimatedText;
const styles = StyleSheet.create({
  container: {
    // marginTop: 10,
    minWidth: width * 0.65,
    alignSelf: "center",
    borderColor: "white",
    height: height * 0.03,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden", // Ensure the text doesn't overflow the container
  },
  text: {
    flexGrow: 1,
    fontSize: 14,
    position: "absolute", // Position the text absolutely
    right: 0, // Align to the left edge of the container
    alignSelf: "flex-end",
  },
});
