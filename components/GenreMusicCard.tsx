import React, { useState } from "react";
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

const data = [
  {
    name: "Joel Lwaga - Olodumare",
    image: "https://i.ytimg.com/vi/CJ2zMja5KR8/hqdefault.jpg",
    link: "https://tubidy.guru/download/joel-lwaga-olodumare/video/CK2aNkh9LS0",
  },
  {
    name: "Marioo & Bien - Nairobi",
    image: "https://i.ytimg.com/vi/04GKMWEwe98/hqdefault.jpg",
    link: "https://tubidy.guru/download/marioo-bien-nairobi/video/78GLNXExe40",
  },
  {
    name: "Koppa Gekon - Calender",
    image: "https://i.ytimg.com/vi/PmzJ0XaHo_U/hqdefault.jpg",
    link: "https://tubidy.guru/download/koppa-gekon-calender/video/QnaK7YhIp_V",
  },
  {
    name: "Iyanii, Mwanaa & Cedo - Kifo Cha Mende",
    image: "https://i.ytimg.com/vi/ywxrFIuokQk/hqdefault.jpg",
    link: "https://tubidy.guru/download/iyanii-mwanaa-cedo-kifo-cha-mende/video/zxysFJvplRl",
  },
  {
    name: "Mbosso - Kupenda",
    image: "https://i.ytimg.com/vi/IlNQ0L9wPsc/hqdefault.jpg",
    link: "https://tubidy.guru/download/mbosso-kupenda/video/JmOR7M4xQtc",
  },
  {
    name: "Ethic Entertainment - UKITAKA",
    image: "https://i.ytimg.com/vi/fxbRMdEwy6I/hqdefault.jpg",
    link: "https://tubidy.guru/download/ethic-entertainment-ukitaka/video/fybSNdExz6J",
  },
  {
    name: "Samidoh - Wendo Wa Ihera",
    image: "https://i.ytimg.com/vi/XUOLMFJDI8o/hqdefault.jpg",
    link: "https://tubidy.guru/download/samidoh-wendo-wa-ihera/video/YVPMNFKDJ0p",
  },
  {
    name: "Zuchu - Lollipop Dance",
    image: "https://i.ytimg.com/vi/xVSvIT3pROQ/hqdefault.jpg",
    link: "https://tubidy.guru/download/zuchu-lollipop-dance/video/yWTwJU3qSPR",
  },
  {
    name: "Savara - Show You Off",
    image: "https://i.ytimg.com/vi/bXlPI9TB20E/hqdefault.jpg",
    link: "https://tubidy.guru/download/savara-show-you-off/video/bYmQJ4UB27E",
  },
  {
    name: "BNXN & Ruger - Bae Bae (Live Session) | Vevo ctrl",
    image: "https://i.ytimg.com/vi/9SM0GM0hTW8/hqdefault.jpg",
    link: "https://tubidy.guru/download/bnxn-ruger-bae-bae-live-session-vevo-ctrl/video/4TN7GN7iUX0",
  },
  {
    name: "Ssaru & Trio Mio - Maintain (Ivo Ivo)",
    image: "https://i.ytimg.com/vi/-Nt0WJFgvTw/hqdefault.jpg",
    link: "https://tubidy.guru/download/ssaru-trio-mio-maintain-ivo-ivo/video/-Ou7XKFgwUx",
  },
  {
    name: "Willy Paul & JZyNO - Kuu Kuu",
    image: "https://i.ytimg.com/vi/zWnUsvm_KqI/hqdefault.jpg",
    link: "https://tubidy.guru/download/willy-paul-jzyno-kuu-kuu/video/aXoVtwn_LrJ",
  },
  {
    name: "Israel Mbonyi - Kaa Nami",
    image: "https://i.ytimg.com/vi/-qCBZixvylo/hqdefault.jpg",
    link: "https://tubidy.guru/download/israel-mbonyi-kaa-nami/video/-rCBAjywzmp",
  },
  {
    name: "Patrick Kubuya - Moyo Wangu (Live)",
    image: "https://i.ytimg.com/vi/HqGkbzg38Bk/hqdefault.jpg",
    link: "https://tubidy.guru/download/patrick-kubuya-moyo-wangu-live/video/IrGlbag30Bl",
  },
  {
    name: "Bella Kombo - Mungu Mmoja (Live) (feat. Evelyn Wanjiru & Neema Gospel Choir)",
    image: "https://i.ytimg.com/vi/Hb7NW5PsrJE/hqdefault.jpg",
    link: "https://tubidy.guru/download/bella-kombo-mungu-mmoja-live-feat-evelyn-wanjiru-neema-gospel-choir/video/Ib5OX9QtsKE",
  },
  {
    name: "Zuchu - WaleWale (feat. Diamond Platnumz)",
    image: "https://i.ytimg.com/vi/XkpK2WDC9q4/hqdefault.jpg",
    link: "https://tubidy.guru/download/zuchu-walewale-feat-diamond-platnumz/video/YlqL2XDC4r8",
  },
  {
    name: "Charisma - SINA NOMA",
    image: "https://i.ytimg.com/vi/lGMsfh8AqmM/hqdefault.jpg",
    link: "https://tubidy.guru/download/charisma-sina-noma/video/mGNtfi0HrnN",
  },
  {
    name: "Dyana Cods - Set It (feat. AJAY)",
    image: "https://i.ytimg.com/vi/9H8shcdvik8/hqdefault.jpg",
    link: "https://tubidy.guru/download/dyana-cods-set-it-feat-ajay/video/4I0ticdwjl0",
  },
  {
    name: "Toxic Lyrikali - CHINJE",
    image: "https://i.ytimg.com/vi/3gpYhCNNxko/hqdefault.jpg",
    link: "https://tubidy.guru/download/toxic-lyrikali-chinje/video/3gqZiCOOylp",
  },
  {
    name: "Marioo & Harmonize - Wangu",
    image: "https://i.ytimg.com/vi/UFcXUcrQKjc/hqdefault.jpg",
    link: "https://tubidy.guru/download/marioo-harmonize-wangu/video/VFcYVcsRLkc",
  },
  {
    name: "D-voice - Nani (feat. Zuchu)",
    image: "https://i.ytimg.com/vi/bw7BKxNP1B8/hqdefault.jpg",
    link: "https://tubidy.guru/download/d-voice-nani-feat-zuchu/video/bx5BLyOQ1B0",
  },
  {
    name: "Jux & Diamond Platnumz - OLOLUFE MI",
    image: "https://i.ytimg.com/vi/6Z5CEE25QH8/hqdefault.jpg",
    link: "https://tubidy.guru/download/jux-diamond-platnumz-ololufe-mi/video/6A9CEE29RI0",
  },
  {
    name: "Ibraah & Harmonize - Dharau",
    image: "https://i.ytimg.com/vi/Iw4t70zCf7s/hqdefault.jpg",
    link: "https://tubidy.guru/download/ibraah-harmonize-dharau/video/Jx8u57aCf5t",
  },
  {
    name: "Ayra Starr - Commas",
    image: "https://i.ytimg.com/vi/EhyzYPSHRQU/hqdefault.jpg",
    link: "https://tubidy.guru/download/ayra-starr-commas/video/EizaZQTISRV",
  },
  {
    name: "Darassa & Harmonize - Mazoea",
    image: "https://i.ytimg.com/vi/08knVOrxw_Q/hqdefault.jpg",
    link: "https://tubidy.guru/download/darassa-harmonize-mazoea/video/70loWPsyx_R",
  },
  {
    name: "HOOD BOYZ & From The Hood Music - NAMKATAA",
    image: "https://i.ytimg.com/vi/mIpJROtFCDA/hqdefault.jpg",
    link: "https://tubidy.guru/download/hood-boyz-from-the-hood-music-namkataa/video/nJqKSPuFCDH",
  },
  {
    name: "Zuchu - Antenna (Official Music Video)",
    image: "https://i.ytimg.com/vi/5fSO9jy0qTI/hqdefault.jpg",
    link: "https://tubidy.guru/download/zuchu-antenna-official-music-video/video/9fTP4kz7rUJ",
  },
  {
    name: "Vicky Brilliance - Wababa_",
    image: "https://i.ytimg.com/vi/fwFzYXeDjeE/hqdefault.jpg",
    link: "https://tubidy.guru/download/vicky-brilliance-wababa/video/fxFaZYeDkeE",
  },
  {
    name: "ROSÉ & Bruno Mars - APT.",
    image: "https://i.ytimg.com/vi/ekr2nIex040/hqdefault.jpg",
    link: "https://tubidy.guru/download/rose-bruno-mars-apt/video/els2oJey787",
  },
  {
    name: "GeniusJini x66 - Far Away (feat. Jay Melody)",
    image: "https://i.ytimg.com/vi/bAFQHwKvD24/hqdefault.jpg",
    link: "https://tubidy.guru/download/geniusjini-x66-far-away-feat-jay-melody/video/bHFRIxLwD28",
  },
];

const MusicCard = ({ name, link }: genreTypes) => {
  const theme = useColorScheme() ?? "light";
  const [state, setState] = useState<"idle" | "loading">("idle");
  return (
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
            />
          )}
        />
      )}
    </ThemedView>
  );
};

export default MusicCard;
