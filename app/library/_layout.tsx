import { ThemedView } from "@/components/ThemedView";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Downloads from "./downloads";
import Playlists from "./playlists";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
const Tab = createMaterialTopTabNavigator();

export default function Tabs() {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: Colors[theme ?? "light"].background,
            width: "100%",
          },
          tabBarScrollEnabled: true,
          tabBarShowIcon: true,
          tabBarActiveTintColor:
            theme == "light"
              ? Colors.light.tabIconDefault
              : Colors.Slider.primary,
          tabBarInactiveTintColor: "grey",
        }}
      >
        <Tab.Screen name="Downloads" component={Downloads} />
        <Tab.Screen name="Playlists" component={Playlists} />
        {/* <Tab.Screen name="DC Comics" component={Dark} /> */}
      </Tab.Navigator>
    </ThemedView>
  );
}
