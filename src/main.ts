import axios from "axios";
import axiosRetry from "axios-retry";
import {
  checkEpisodeExists,
  populateData,
  populateEpisodes,
  populateSources,
  populateSubtitles,
} from "./modules/index";

axiosRetry(axios, {
  retries: 50,
  retryDelay: (retryCount) => {
    return 1000;
  },
  onRetry: (retryCount, error, requestConfig) => {
    console.error(
      `Retry attempt #${retryCount} for request: ${requestConfig.url}`
    );
  },
});

export const getEpisodes = async (dataJson: any) => {
  for (let i = 0; i < dataJson.episodes.length; i++) {
    console.log(
      `Fetching data for ${dataJson.episodes[i].id} -> ${i + 1} / ${
        dataJson.episodes.length
      }`
    );
    try {
      let { data } = await axios.get(
        `${process.env.consumetURL}/movies/flixhq/watch?episodeId=${dataJson.episodes[i].id}&mediaId=${dataJson.id}`
      );

      populateEpisodes(dataJson.episodes[i], dataJson.id);

      const status = await checkEpisodeExists(dataJson.episodes[i].id);
      if (status) {
        populateSources(data.sources, dataJson.episodes[i].id);
        populateSubtitles(data.subtitles, dataJson.episodes[i].id);
      } else {
        console.error(
          `Resources for episode ${dataJson.episodes[i].id} could not be populated`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
};

export const getInfo = async (id: string) => {
  try {
    let { data } = await axios.get(
      `${process.env.consumetURL}/movies/flixhq/info?id=${id}`
    );
    populateData(data);
    getEpisodes(data);
  } catch (error) {
    console.error(error);
  }
};

// getInfo("movie/watch-fight-club-19651");
