import { ThemedView } from "@/components/ThemedView";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Downloads from "./downloads";
import Playlists from "./playlists";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import Favourites from "./favourites";
import { ThemedText } from "@/components/ThemedText";
import SegmentedControl from "@/components/SegmentedControls";
import { useState } from "react";

const Tab = createMaterialTopTabNavigator();

export default function Tabs() {
  const theme = useColorScheme() ?? "light";
  const options = ["Downloads", "Favourites", "Playlists"];
  const [selected, setSelected] = useState<
    "Downloads" | "Favourites" | "Playlists"
  >("Downloads");
  return (
    <ThemedView style={{ flex: 1 }}>
      <SegmentedControl options={options} onChange={setSelected} />
      {selected == "Downloads" ? (
        <Downloads />
      ) : selected == "Favourites" ? (
        <Favourites />
      ) : (
        <Playlists />
      )}
    </ThemedView>
    // <Tab.Navigator
    //   screenOptions={{
    //     tabBarStyle: {
    //       backgroundColor: Colors[theme ?? "light"].background,
    //       width: "100%",
    //     },
    //     tabBarScrollEnabled: true,
    //     tabBarShowIcon: true,
    //     tabBarActiveTintColor:
    //       theme == "light"
    //         ? Colors.light.tabIconDefault
    //         : Colors.Slider.primary,
    //     tabBarInactiveTintColor: "grey",
    //   }}
    // >
    //   <Tab.Screen name="Downloads" component={Downloads} />
    //   <Tab.Screen name="Favourites" component={Favourites} />
    //   <Tab.Screen name="Playlists" component={Playlists} />
    // </Tab.Navigator>
    // </ThemedView>
  );
}
