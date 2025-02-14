import { pagerHeaderProps } from "@/types";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import Styles from "@/style";

const PagerHeader = ({ title, description }: pagerHeaderProps) => {
  return (
    <ThemedView style={Styles.pagerHeader}>
      <ThemedText style={Styles.headText}>{title}</ThemedText>
      {description ? (
        <ThemedText style={Styles.descText}>{description}</ThemedText>
      ) : (
        <></>
      )}
    </ThemedView>
  );
};

export default PagerHeader;
