import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Styles from "@/style";
import { Colors } from "@/constants/Colors";
import { toggleButtonProp } from "@/types";

const Toggle = ({
  Text,
  isSelectable,
  Parent,
  setParent,
}: toggleButtonProp) => {
  const [isSelected, setSelected] = useState(false);
  useEffect(() => {
    if (Text == Parent) {
      setSelected(true);
      return;
    }
    setSelected(false);
  }, [Parent]);
  return (
    <TouchableOpacity
      style={[Styles.toggleContainer, { opacity: isSelectable ? 1 : 0.5 }]}
      onPress={() => {
        if (isSelectable) {
          setParent(Text);
          if (Text == Parent) {
            setSelected(true);
          } else {
            setSelected(false);
          }
        }
      }}
    >
      <ThemedText style={{ fontSize: 12 }}>{Text}</ThemedText>
      <View
        style={{
          borderWidth: 1,
          borderColor: Colors.Slider.primary,
          padding: 5,
          borderRadius: 100,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={[
            Styles.toggleisSelector,
            {
              backgroundColor: isSelected
                ? Colors.Slider.primary
                : "transparent",
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Toggle;
