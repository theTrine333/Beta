import * as Cheerio from "react-native-cheerio";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
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

      if (
        !["Upload", "My Stats", "My Playlists", "Login", "My Account"].includes(
          text
        )
      ) {
        genres.push({
          name: text,
          link: link,
        });
      }
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

        subGenres.push({
          name: title,
          link: link,
          image: image,
        });
      } catch (error) {
        console.error("Error parsing element:", error);
      }
    });
    return subGenres;
  } catch (error) {
    return [];
  }
};
export const formatTime = (seconds) => {
  let minutes = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  minutes = minutes > 0 ? minutes : 0;
  secs = secs > 0 ? secs : 0;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
export const getSpecificGenre = async (url) => {
  try {
    let inGenres = [];
    const timer = setTimeout(() => {
      inGenres = null;
      return null;
    }, 10 * 1000);

    const response = await fetch(url);
    clearTimeout(timer);
    const html = await response.text();
    const $ = Cheerio.load(html);

    const items = $(".video-list.row .col-lg-6");

    items.each((index, video) => {
      const time = $(video).find("time.duration").text().trim();
      const titleElement = $(video).find(".title");
      const name = titleElement.text();
      const link = titleElement.attr("href");
      const poster = $(video).find("img").attr("data-src");

      inGenres.push({
        name: name,
        image: poster,
        link: link,
        duration: time,
      });
    });
    return inGenres;
  } catch (error) {
    clearImmediate(timer);
    return null;
  }
};

export async function shareFile(name) {
  const status = await Sharing.isAvailableAsync();
  const location = FileSystem.documentDirectory + name + ".mp3";
  if (status) {
    await Sharing.shareAsync(location, { dialogTitle: "Beta : Play" });
  } else {
    Alert.alert(
      "Share not supported",
      "Sorry this devices doen't support this feature yet",
      [{ text: "Ok", onPress: () => {}, style: "default" }]
    );
  }
}

export function extractAudioHash(script) {
  const match = script.match(/Api\.track\('([^']+)'\)/);
  return match ? match[1] : null;
}

export function extractVideoHash(script) {
  const match = script.match(/App\.video\('([^']+)'\)/);
  return match ? match[1] : null;
}

export async function getHashes(link) {
  const url = `${link}`;

  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = Cheerio.load(html);

    const scripts = $("script").toArray();
    const audioHash = extractAudioHash($(scripts[2]).html());
    const videoHash = extractVideoHash($(scripts[4]).html());
    return {
      audio_hash: audioHash,
      video_hash: videoHash,
      referrer: url,
    };
  } catch (error) {
    return null;
  }
}

export async function getFormats(load) {
  const url = "https://tubidy.guru/api/video/formats";

  const payload = {
    payload: `${load}`,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    return await response.json();
  } catch (error) {
    // console.error("Error fetching formats:", error);
    return null;
  }
}

export async function get_downloadLink(load) {
  const url = "https://tubidy.guru/api/video/download";
  const payload = {
    payload: `${load}`,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

export async function oneTimeDownloadLink(link) {
  try {
    const hashes = await getHashes(link);
    const formats = await getFormats(hashes?.video_hash);
    const downloadLink = await get_downloadLink(formats?.formats[0]?.payload);

    let uri = downloadLink?.link;

    return uri;
  } catch (e) {
    // console.log(e);
    return null;
  }
}

export const getSongSearch = async (search) => {
  try {
    const formattedSearch = search.replace(/ /g, "+");
    const searchUrl = `https://tubidy.guru/search?q=${formattedSearch}`;

    const response = await fetch(searchUrl);
    const body = await response.text();
    const $ = Cheerio.load(body);

    const container = $(".video-list.row.mt-4");
    const items = container.find(".col-lg-6");

    let hits = [];

    items.each((_, item) => {
      const detailsContainer = $(item).find("a");
      const link = detailsContainer.attr("href");
      const poster = detailsContainer.find("img").attr("data-src");
      const name = detailsContainer.find("img").attr("alt");
      const duration = $(item).find(".duration").text().trim();

      hits.push({
        name: name,
        image: poster,
        link: link,
        duration: duration,
      });
    });

    return hits;
  } catch (error) {
    return null;
  }
};
export const shuffleArray = (array) => {
  let shuffled = [...array]; // Create a copy to avoid modifying the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Pick a random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
};
