import { get_sub_genre, getGenres } from "./q";
import * as FileSystem from "expo-file-system";
export const insertSubGenre = async (db, name, link, image, parent) => {
  try {
    await db.runAsync(
      "INSERT INTO subGenres(name, link, image, parent) VALUES (?, ?, ?, ?)",
      [`${name}`, `${link}`, `${image}`, `${parent}`]
    );
  } catch (error) {}
};

export const insertGenre = async (db, name, link) => {
  try {
    await db.runAsync("INSERT INTO Genres (name, link) VALUES (?, ?)", [
      name,
      link,
    ]);
  } catch (error) {}
};

export const get_db_Genres = async (db) => {
  try {
    let results = await db.getAllAsync("SELECT name,link FROM Genres");
    if (results.length == 0) {
      results = await getGenres();
    }
    return results;
  } catch (error) {
    return [];
  }
};

export const get_sub_genres = async (db, link) => {
  try {
    let results = await db.getAllAsync(
      "SELECT name,link,image FROM subGenres WHERE parent = ? LIMIT 4",
      [link]
    );
    if (results.length == 0) {
      results = await get_sub_genre(link);
    }
    return results;
  } catch (error) {
    return [];
  }
};

export const get_all_sub_genres = async (db, link) => {
  try {
    let results = await db.getAllAsync(
      "SELECT DISTINCT name,link,image FROM subGenres WHERE parent = ?",
      [link]
    );
    if (results.length == 0) {
      results = await get_sub_genre(link);
    }
    return results;
  } catch (error) {
    return [];
  }
};

export const getGenreSearch = async (db, text) => {
  try {
    let results = await db.getAllAsync(
      "SELECT DISTINCT name AS Name, link AS Link, image AS Poster FROM subGenres WHERE name LIKE ?",
      [`%${text}%`] // Use '%' wildcards within the parameter array
    );
    return results;
  } catch (error) {
    return null;
  }
};

export const getDownloadsSearch = async (db, text) => {
  try {
    let results = await db.getAllAsync(
      "SELECT Name as name,Image as image,Duration as duration, location as link FROM Downloads WHERE name LIKE ?",
      [`%${text}%`] // Use '%' wildcards within the parameter array
    );

    return results;
  } catch (error) {
    return null;
  }
};

export const getFavouritesSearch = async (db, text) => {
  try {
    let results = await db.getAllAsync(
      "SELECT DISTINCT name AS Name, link AS Link, image AS Poster FROM favourites WHERE name LIKE ?",
      [`%${text}%`] // Use '%' wildcards within the parameter array
    );
    return results;
  } catch (error) {
    return null;
  }
};
export const insertFavourite = async (db, name, image, link, inType) => {
  try {
    await db.runAsync(
      "INSERT INTO favourites (name, image, link, inType) VALUES (?, ?, ?, ?)",
      [name, image, link, inType]
    );
  } catch (error) {
    console.error("Error inserting favourite:", error);
  }
};

export const insertDownload = async (
  db,
  name,
  image,
  duration,
  link,
  location
) => {
  try {
    await db.runAsync(
      "INSERT INTO Downloads (Name, Image, Duration,Link, location) VALUES (?, ?, ?, ?, ?)",
      [name, image, duration, link, location]
    );
  } catch (error) {
    console.error("Error inserting download:", error);
  }
};

export const get_db_downloadLink = async (db, name) => {
  try {
    const result = await db.getFirstAsync(
      `SELECT Location as uri from Downloads where Name="${name}"`
    );
    return result;
  } catch (error) {
    console.log("Error fetching download link");
  }
};

export const getFavouritesLenght = async (db) => {
  try {
    const results = await db.getAllAsync("SELECT * FROM favourites");
    return results.length;
  } catch (error) {
    return [];
  }
};

export const getFavourites = async (db) => {
  try {
    const results = await db.getAllAsync(
      "SELECT name,image,link FROM favourites ORDER BY id DESC"
    );
    return results;
  } catch (error) {
    return [];
  }
};

export const getDownloads = async (db) => {
  try {
    const results = await db.getAllAsync(
      "SELECT Name as name,Image as image,Duration as duration,Location as uri FROM Downloads ORDER BY id DESC"
    );
    return results;
  } catch (error) {
    return [];
  }
};

export const deleteDownload = async (db, name, loader) => {
  try {
    await db.runAsync(`DELETE FROM DOwnloads where Name="${name}"`);
    await FileSystem.deleteAsync(FileSystem.documentDirectory + name + ".mp3");
    loader();
  } catch (error) {
    console.log("Deleting error : ", error);
  }
};

export const isDownload = async (db, location) => {
  try {
    const results = await db.getFirstAsync(
      `SELECT * FROM Downloads where Location="${location}"`
    );
    return results !== null;
  } catch (error) {
    return [];
  }
};

export const deleteFavourite = async (db, name) => {
  try {
    await db.runAsync("DELETE FROM favourites WHERE name = ?", [name]);
  } catch (error) {}
};

export const isFavourite = async (db, name) => {
  try {
    const results = await db.getFirstAsync(
      `SELECT * FROM favourites WHERE name="${name}"`
    );

    return results !== null;
  } catch (error) {
    return false;
  }
};
export const insertPlaylist = async (db, name) => {
  try {
    await db.runAsync("INSERT INTO Playlists(Name) VALUES(?)", [name]);
  } catch (error) {}
};

export const getPlaylists = async (db) => {
  try {
    const results = await db.getAllAsync(
      `SELECT 
        Playlists.Name,
        COUNT(PlaylistItems.Id) AS TotalItems
      FROM 
        Playlists
      LEFT JOIN 
        PlaylistItems ON PlaylistItems.Parent = Playlists.Id
      GROUP BY 
        Playlists.Name;`
    );
    return results;
  } catch (error) {
    throw error;
  }
};

export const getPlaylistItems = async (db, name) => {
  try {
    const results = await db.getAllAsync(
      `SELECT Name as name,Image as image, Link as link from PlayListItems where Parent="${name}"`
    );
    return results;
  } catch (error) {
    console.log("Error getting playlist items");
  }
};

export const insertPlaylistItem = async (db, name, image, link, parent) => {
  try {
    await db.runAsync(
      "INSERT INTO PlayListItems(Name,Image,Link,Parent) VALUES (?,?,?,?)",
      [`${name}`, `${image}`, `${link}`, `${parent}`]
    );
  } catch (error) {
    console.log("Error insterting item :" + name + " \n" + error);
  }
};

export const deltePlalistItem = async (name, link) => {
  try {
    await db.runAsync();
  } catch (error) {}
};
