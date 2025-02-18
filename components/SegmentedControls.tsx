import { SegmentedControlProps } from "@/types";
import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, useColorScheme } from "react-native";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

const SegmentedControl = ({ options, onChange }: SegmentedControlProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const theme = useColorScheme() ?? "light";
  const handlePress = (index: any) => {
    setSelectedIndex(index);
    if (onChange) {
      onChange(options[index]);
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor:
            theme == "light" ? "lightgrey" : Colors.dark.background,
        },
      ]}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            selectedIndex === index && styles.selectedOption,
          ]}
          onPress={() => handlePress(index)}
        >
          {selectedIndex === index ? (
            <ThemedText
              style={[
                styles.optionText,
                selectedIndex === index && styles.selectedText,
                ,
                { color: "white" },
              ]}
            >
              {option}
            </ThemedText>
          ) : (
            <ThemedText
              style={[
                styles.optionText,
                ,
                { color: theme == "light" ? "#333" : "lightgrey" },
              ]}
            >
              {option}
            </ThemedText>
          )}
        </TouchableOpacity>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    marginTop: 8,
    padding: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  selectedOption: {
    backgroundColor: Colors.Slider.primary,
  },
  optionText: {
    fontSize: 16,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
export default SegmentedControl;
