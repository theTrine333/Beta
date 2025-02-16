import { pagerHeaderProps } from "@/types";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Styles from "@/style";
import { useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";

const PagerHeader = ({ title, description }: pagerHeaderProps) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView style={Styles.pagerHeader}>
      <ThemedText style={Styles.headText}>{title}</ThemedText>
      {description ? (
        <ThemedText
          style={[
            Styles.descText,
            {
              color: theme == "dark" ? Colors.Slider.primary : "grey",
            },
          ]}
        >
          {description}
        </ThemedText>
      ) : (
        <></>
      )}
    </ThemedView>
  );
};

export default PagerHeader;
