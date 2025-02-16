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

export const getSpecificGenre = async (url) => {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = Cheerio.load(html);

    const items = $(".video-list.row .col-lg-6");
    const inGenres = [];

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
    console.error("Error fetching specific genres:", error);
    return [];
  }
};

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
    console.error("Error fetching data:", error);
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
        Name: name,
        Poster: poster,
        Link: link,
        Time: duration,
      });
    });

    return hits;
  } catch (error) {
    return null;
  }
};
