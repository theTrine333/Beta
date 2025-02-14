import React, { useEffect, useRef } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";

const SpinningDisk = ({ imageSource, size = 200 }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.Image
        source={{ uri: imageSource }}
        style={[
          styles.disk,
          { width: size, height: size, transform: [{ rotate: spin }] },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  disk: {
    borderRadius: 1000, // Ensures it's circular
  },
});

export default SpinningDisk;
