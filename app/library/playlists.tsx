import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles from "@/style";
import ListCard from "@/components/PlayListCard";
import { useSQLiteContext } from "expo-sqlite";
import { getFavouritesLenght, getPlaylistItems } from "@/api/database";
import { useRouter } from "expo-router";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { PlaylistAddModal } from "@/components/CustomModals";

const Playlists = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [data, setData] = useState();
  const [favNumber, setFavNumber] = useState(0);
  const [refresh, setRefresh] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "empty" | "error">(
    "idle"
  );
  const theme = useColorScheme() ?? "light";
  const loader = async () => {
    let fav = await getFavouritesLenght(db);
    let otherPlalists = await getPlaylistItems(db);
    setFavNumber(fav);
    setRefresh(false);
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <ThemedView style={[Styles.container, { padding: 10, paddingTop: 10 }]}>
      {modalVisible ? <PlaylistAddModal setVisible={setModalVisible} /> : <></>}

      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <ThemedText style={{ fontSize: 13 }}>Playlists</ThemedText>
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            setModalVisible(true);
          }}
        >
          <AntDesign
            name="pluscircleo"
            size={20}
            color={Colors[theme ?? "light"].text}
          />
        </TouchableOpacity>
      </View>
      {/* <ListCard counter={favNumber} title={"Favourites"} router={router} /> */}
    </ThemedView>
  );
};

export default Playlists;
