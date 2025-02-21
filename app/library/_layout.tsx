import { ThemedView } from "@/components/ThemedView";
import Downloads from "./downloads";
import Playlists from "./playlists";
import { useColorScheme } from "react-native";
import SegmentedControl from "@/components/SegmentedControls";
import { useState } from "react";

export default function Tabs() {
  const theme = useColorScheme() ?? "light";
  const options = ["Downloads", "Playlists"];
  const [selected, setSelected] = useState<
    "Downloads" | "Favourites" | "Playlists"
  >("Downloads");

  return (
    <ThemedView style={{ flex: 1 }}>
      <SegmentedControl options={options} onChange={setSelected} />
      {selected == "Downloads" ? <Downloads /> : <Playlists />}
    </ThemedView>
  );
}
