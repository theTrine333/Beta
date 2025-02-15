import { get_sub_genre, getGenres } from "./q";

export const insertSubGenre = async (db, name, link, image, parent) => {
  try {
    await db.runAsync(
      "INSERT INTO subGenres(name, link, image, parent) VALUES (?, ?, ?, ?)",
      [`${name}`, `${link}`, `${image}`, `${parent}`]
    );
  } catch (error) {
    console.log("An error occured while recording sub-genres\n", error);
  }
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
    console.error("Database error:", error);
    return [];
  }
};
