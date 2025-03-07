import axios from "axios";
import dotenv from "dotenv";
import axiosRetry from "axios-retry";
import {
  populateData,
  populateEpisodes,
  populateSources,
  populateSubtitles,
} from "./modules";

dotenv.config();
axiosRetry(axios, {
  retries: 50,
  onRetry: (retryCount, error, requestConfig) => {
    console.log(
      `Retry attempt #${retryCount} for request: ${requestConfig.url}`
    );
  },
});

const getEpisodes = async (dataJson: any) => {
  for (let i = 0; i < dataJson.episodes.length; i++) {
    console.log(
      `Fetching data for ${dataJson.episodes[i].id} -> ${i + 1} / ${
        dataJson.episodes.length
      }`
    );
    try {
      let response = await axios.get(
        `${process.env.consumetURL}/movies/flixhq/watch?episodeId=${dataJson.episodes[i].id}&mediaId=${dataJson.id}`
      );

      populateEpisodes(dataJson.episodes[i], dataJson.id);
      populateSources(response.data.sources, dataJson.episodes[i].id);
      populateSubtitles(response.data.subtitles, dataJson.episodes[i].id);

      console.log("Created episode with id: " + dataJson.episodes[i].id);
    } catch (error) {
      console.error(error);
    }
  }
};

const getInfo = async (id: string) => {
  try {
    let response = await axios.get(
      `${process.env.consumetURL}/movies/flixhq/info?id=${id}`
    );
    populateData(response.data);
    getEpisodes(response.data);
  } catch (error) {
    console.error(error);
  }
};

getInfo("tv/watch-desperate-housewives-39247");
