import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from "react-native";
import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Styles, { height, width } from "@/style";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { playlistCardItem } from "@/types";
import { deletePlaylist, insertPlaylistItem } from "@/api/database";

const ListCard = ({
  title,
  counter,
  router,
  setFav,
  connector,
  childImage,
  childLink,
  childName,
  loaderFunc,
  setVisible,
}: playlistCardItem) => {
  const theme = useColorScheme() ?? "light";
  return (
    <TouchableOpacity
      style={[
        Styles.libraryCard,
        {
          paddingHorizontal: 10,
          height: height * 0.06,
          marginTop: 5,
          borderWidth: 1,
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
        },
      ]}
      onPress={async () => {
        if (router) {
          router.push({
            pathname: "Playlist",
            params: { Title: title, Counter: counter },
          });
        }

        if (setFav) {
          await insertPlaylistItem(
            connector,
            childName,
            childImage,
            childLink,
            title
          );
        }
        setVisible(false);
      }}
      onLongPress={() => {
        if (title == "favourites") return;
        if (loaderFunc) {
          Alert.alert(
            "Delete playlist",
            "Do you wish to delete this playlists",
            [
              {
                text: "Confirm",
                style: "destructive",
                onPress: async () => {
                  await deletePlaylist(connector, title, loaderFunc);
                },
              },

              { text: "Cancel", style: "cancel", onPress: () => {} },
            ]
          );
        }
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
          {counter ? (
            <ThemedText style={{ fontSize: 11 }}>{counter} Songs</ThemedText>
          ) : (
            <></>
          )}
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
