import { ThemedView } from "@/components/ThemedView";
import Downloads from "./downloads";
import Playlists from "./playlists";
import { useColorScheme } from "react-native";
import Favourites from "./favourites";
import SegmentedControl from "@/components/SegmentedControls";
import { useState } from "react";

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
  );
}
