import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import SkeletonLoader from "expo-skeleton-loader";
import Styles, { height } from "@/style";
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { genreTypes } from "@/types";
import { AntDesign } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import GenreMusicCardItem from "./GenreMusicCardItem";
import { get_sub_genre } from "@/api/q";
import { get_sub_genres, insertGenre, insertSubGenre } from "@/api/database";

const MusicCard = ({ name, link, db, router }: genreTypes) => {
  const theme = useColorScheme() ?? "light";
  const [state, setState] = useState<"idle" | "loading" | "error">("loading");
  const [data, setData] = useState();

  const loader = async () => {
    try {
      setState("loading");
      const subGenre = await get_sub_genres(db, link);
      await subGenre.forEach(async (element: any) => {
        await insertSubGenre(
          db,
          element.name,
          element.link,
          element.image,
          link
        );
      });
      setData(subGenre);
      setState("idle");
    } catch {
      setState("idle");
    }
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <>
      {state == "error" ? (
        <></>
      ) : (
        <ThemedView style={Styles.rowMusicCardsContainer}>
          {/* Showing title and nav button */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <ThemedText style={[Styles.headText, { fontSize: 15 }]}>
              {name}
            </ThemedText>
            {state == "loading" ? (
              <SkeletonLoader duration={1800}>
                <SkeletonLoader.Item style={Styles.moreLoadingBtn} />
              </SkeletonLoader>
            ) : (
              <TouchableOpacity style={Styles.moreBtn}>
                <ThemedText style={{ fontSize: 11 }}>More</ThemedText>
                <AntDesign
                  name="right"
                  size={11}
                  color={Colors[theme ?? "light"].text}
                />
              </TouchableOpacity>
            )}
          </View>
          {/* Showing content got from search */}
          {state == "loading" ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                minHeight: height * 0.23,
              }}
            >
              <SkeletonLoader
                style={Styles.rowCardLoadingContainer}
                duration={1800}
              >
                <SkeletonLoader.Item style={Styles.rowCardLoadingItem} />
                <SkeletonLoader.Item style={Styles.rowCardLoadingItem} />
                <SkeletonLoader.Item style={Styles.rowCardLoadingItem} />
              </SkeletonLoader>
            </ScrollView>
          ) : (
            <FlatList
              data={data}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={Styles.rowMusicIListContainer}
              renderItem={({ item }) => (
                <GenreMusicCardItem
                  name={item.name}
                  link={item.link}
                  image={item.image}
                  router={router}
                />
              )}
            />
          )}
        </ThemedView>
      )}
    </>
  );
};

export default MusicCard;
