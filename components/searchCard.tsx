import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Styles from "@/style";
import { TextInput, TouchableOpacity, useColorScheme } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { SearchCardProps } from "@/types";

const SearchCard = ({
  inType,
  shouldNavigate,
  action,
  setter,
  word,
  Parent,
}: SearchCardProps) => {
  const theme = useColorScheme() ?? "light";
  const router = useRouter();
  const [Word, setWord] = useState(word);

  const handleSubmit = async () => {
    if (shouldNavigate) {
      router.push({
        pathname: "/search",
        params: {
          word: Word,
          inType: inType,
          Parent: Parent,
        },
      });
    }

    if (action) {
      action();
    }
  };
  useEffect(() => {
    if (setter) {
      setter(word);
    }
  }, [word]);
  return (
    <ThemedView style={Styles.searchCard}>
      <TextInput
        style={[Styles.searchInput, { color: Colors[theme ?? "light"].text }]}
        placeholder={
          Parent == "songs"
            ? "Search for a song"
            : Parent == "downloads"
            ? "Search in downloads"
            : Parent == "favourites"
            ? "Search in favourites"
            : "Search in genres"
        }
        placeholderTextColor={"grey"}
        value={Word}
        onChangeText={(e) => {
          if (setter) {
            setter(e);
          }
          setWord(e);
        }}
        cursorColor={Colors[theme ?? "light"].text}
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <AntDesign name="search1" color={Colors.Slider.primary} size={25} />
      </TouchableOpacity>
    </ThemedView>
  );
};

export default SearchCard;
