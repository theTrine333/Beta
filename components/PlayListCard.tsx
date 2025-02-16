import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Styles from "@/style";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { playlistCardItem } from "@/types";

const ListCard = ({ title, counter, router }: playlistCardItem) => {
  const theme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity
      style={[
        Styles.libraryCard,
        {
          paddingHorizontal: 10,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        },
      ]}
      onPress={() => {
        router.push({
          pathname: "Playlist",
          params: { Title: title, Counter: counter },
        });
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <FontAwesome5
          name="headphones-alt"
          size={24}
          color={Colors[theme ?? "light"].text}
        />
        <View>
          <ThemedText>{title}</ThemedText>
          <ThemedText style={{ fontSize: 11 }}>{counter} Songs</ThemedText>
        </View>
      </View>

      <TouchableOpacity>
        <AntDesign
          color={Colors[theme ?? "light"].text}
          name="playcircleo"
          size={25}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default ListCard;
