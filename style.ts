import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "./constants/Colors";
export const { width, height } = Dimensions.get("screen");
export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  playerImage: {
    borderRadius: 8,
    elevation: 4,
    width: width * 0.9,
    height: height * 0.4,
    // borderRadius: 150,
    alignSelf: "center",
  },
  playerSlider: {
    width: width * 0.7,
  },
  playerBtn: {
    // borderWidth: 1,
    borderColor: "white",
    padding: 10,
    justifyContent: "center",
  },
  playerControlsContainer: {
    alignSelf: "center",
    width: width * 0.9,
    padding: 10,
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
    // borderWidth: 1,
    borderColor: "white",
    marginTop: 30,
  },
  durationHolder: { marginTop: 10, flexDirection: "row", alignSelf: "center" },
  libraryImageComponent: {
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 10,
    width: width * 0.2,
    height: height * 0.07,
  },
  libraryCard: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderColor: "grey",
    margin: 5,
    paddingTop: 3,
    borderRadius: 8,
  },
  rowImageComponent: {
    width: width * 0.45,
    height: height * 0.14,
    borderRadius: 8,
  },
  genreImage: {
    width: width,
    height: height * 0.45,
    backgroundColor: "transparent",
  },
  genreGradient: {
    position: "absolute",
    bottom: 0,
    top: 1,
    left: 0,
    right: 0,
    height: height * 0.45,
  },
  genreLoaderCard: {
    width: width * 0.9,
    alignSelf: "center",
    height: height * 0.06,
    borderRadius: 8,
    marginTop: 10,
  },
  rowMusicItemTitle: {
    fontSize: 11,
    maxWidth: width * 0.4,
    lineHeight: 15,
    marginTop: 10,
  },
  rowMusicIListContainer: {
    borderWidth: 1,
    gap: 10,
    borderColor: "white",
  },
  rowCardLoadingContainer: {
    flexDirection: "row",
    gap: 10,
    height: height * 0.2,
  },
  rowCardLoadingItem: {
    borderRadius: 8,
    width: width * 0.6,
    height: height * 0.18,
    marginVertical: 10,
  },
  moreBtn: {
    flexDirection: "row",
    backgroundColor: "orange",
    gap: 5,
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  moreLoadingBtn: {
    height: height * 0.03,
    width: width * 0.2,
    borderRadius: 8,
  },
  rowMusicCardsContainer: {
    height: height * 0.23,
    marginTop: 5,
    paddingTop: 5,
  },
  pagerHeader: {
    borderBottomWidth: 0.5,
    borderColor: "grey",
    paddingBottom: 10,
    marginHorizontal: 20,
  },
  verticalListContainer: {
    height: height * 0.85,
    marginTop: 10,
    paddingBottom: 60,
    paddingHorizontal: 10,
  },
  headText: { fontSize: 24, fontWeight: "bold", fontFamily: "ExoRegular" },
  descText: { fontSize: 14, fontFamily: "PacifioRegular" },
});
export default Styles;
