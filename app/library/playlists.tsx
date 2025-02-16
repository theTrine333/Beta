import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles from "@/style";
import ListCard from "@/components/PlayListCard";
import { useSQLiteContext } from "expo-sqlite";
import { getFavouritesLenght } from "@/api/database";
import { useRouter } from "expo-router";

const Playlists = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const [data, setData] = useState();
  const [favNumber, setFavNumber] = useState(0);
  const [state, setState] = useState<"idle" | "loading" | "empty" | "error">(
    "idle"
  );

  const loader = async () => {
    const fav = await getFavouritesLenght(db);
    setFavNumber(fav);
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <ThemedView style={[Styles.container, { padding: 10, paddingTop: 10 }]}>
      <ListCard counter={favNumber} title={"Favourites"} router={router} />
    </ThemedView>
  );
};

export default Playlists;
