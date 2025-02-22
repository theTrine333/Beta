import { Stack } from "expo-router";
import { useEffect } from "react";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Suspense, useState } from "react";
import "react-native-reanimated";
import { SQLiteProvider } from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { useColorScheme } from "@/hooks/useColorScheme";
import { ThemedView } from "@/components/ThemedView";
import { ActivityIndicator, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import Styles, { blurhash } from "@/style";
import { LinearGradient } from "expo-linear-gradient";
import { AudioPlayerProvider } from "@/hooks/audioPlayer";
import { DownloadProvider } from "@/hooks/downloadContext";

SplashScreen.preventAutoHideAsync();

const loadDatabase = async () => {
  const dbName = "play.db";
  const dbAsset = require("@/assets/db/play.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      {
        intermediates: true,
      }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function RootLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [dbLoaded, setDbLoaded] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ExoRegular: require("../assets/fonts/Exo2-Regular.ttf"),
    PacifioRegular: require("../assets/fonts/Pacifico-Regular.ttf"),
  });

  useEffect(() => {
    loadDatabase()
      .then(() => {
        setDbLoaded(true);
      })
      .catch((e) => console.error("Database load error: ", e));
  }, []);

  useEffect(() => {
    if (dbLoaded && loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark.background }}>
        <Image
          style={Styles.genreImage}
          source={require("@/assets/images/icon.png")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <LinearGradient
          colors={["transparent", Colors.dark.background]}
          style={Styles.genreGradient}
        />
        <ActivityIndicator
          size={32}
          style={{ marginTop: 10 }}
          color={Colors.Slider.primary}
        />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Suspense
        fallback={
          <ActivityIndicator size="large" color={Colors.Slider.primary} />
        }
      >
        <SQLiteProvider databaseName="play.db" useSuspense>
          <AudioPlayerProvider>
            <DownloadProvider>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="moreGenres"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="genre" options={{ headerShown: false }} />
                <Stack.Screen name="search" options={{ headerShown: false }} />
                <Stack.Screen
                  name="Playlist"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="player" options={{ headerShown: false }} />
              </Stack>
            </DownloadProvider>
          </AudioPlayerProvider>
        </SQLiteProvider>
      </Suspense>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
