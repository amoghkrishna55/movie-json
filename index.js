import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getEpisodes = async (dataJson, child = false) => {
  for (let i = 0; i < dataJson.episodes.length; i++) {
    console.log(i);
    console.log(dataJson.episodes[i].id + " " + dataJson.id);
    try {
      let response = await axios.get(
        `${process.env.consumetURL}/movies/flixhq/watch?episodeId=${dataJson.episodes[i].id}&mediaId=${dataJson.id}`
      );
      response = response.data;
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  }
};

const getInfo = async (id, child = false) => {
  let count = 1;
  try {
    let response = await axios.get(
      `${process.env.consumetURL}/movies/flixhq/info?id=${id}`
    );
    response = response.data;
    delete response.recommendations;
    getEpisodes(response);
    // console.log(response);
    return true;
  } catch (error) {
    if (child) {
      return false;
    }
    while (count <= 50) {
      console.log(`Retrying to fetch Movie Info ${count}`);
      const runChild = await getInfo(id, true);
      if (runChild) {
        return true;
      } else {
        count++;
      }
    }
    console.log("Mamimum retries reached");
  }
};

getInfo("tv/watch-desperate-housewives-39247");
