import * as Cheerio from "react-native-cheerio";

const genreUrl = "https://musicza.co.za/";

export const getGenres = async () => {
  try {
    const response = await fetch(genreUrl);
    const html = await response.text();
    const $ = Cheerio.load(html);
    const items = $(".nav-item.dropdown").find("a");
    let genres = [];
    items.each((index, element) => {
      if (index === 0) return;
      const link = $(element).attr("href") || "";
      const text = $(element).text().trim();
      genres.push({
        name: text,
        link: link,
      });
    });
    return genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const get_sub_genre = async (genre_url) => {
  try {
    const response = await fetch(genre_url);
    const html = await response.text();
    const $ = Cheerio.load(html);
    const subGenres = [];

    $(".playlists.row.row-gap-5 a").each((index, element) => {
      try {
        const title = $(element).text().trim();
        const link = $(element).attr("href");
        const image = $(element).find("img").attr("data-src");

        if (
          title !==
          ("Upload" || "My Stats" || "My Playlists" || "Login" || "My Account")
        ) {
          subGenres.push({
            name: title,
            link: link,
            image: image,
          });
        }
      } catch (error) {
        console.error("Error parsing element:", error);
      }
    });

    return subGenres;
  } catch (error) {
    return [];
  }
};
