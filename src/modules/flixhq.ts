import { MOVIES } from "@consumet/extensions";

const flixhq = new MOVIES.FlixHQ();

export const searchMedia = async (mediaID: string, maxRetries: number = 50) => {
  let attempts = 0;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < maxRetries) {
    try {
      const res = await flixhq.search(mediaID, 1);
      console.log(res);
      return res;
    } catch (error) {
      attempts++;
      console.error(
        `Error searching for media : ${mediaID} -> ${attempts}/${maxRetries}`
      );
      if (attempts < maxRetries) {
        console.log(`Retrying in 1 second...`);
        await delay(1000);
      } else {
        console.error(
          `Failed to search for media after ${maxRetries} attempts.`
        );
      }
    }
  }
};

export const getMediaInfo = async (
  mediaID: string,
  maxRetries: number = 50
) => {
  let attempts = 0;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < maxRetries) {
    try {
      const res = await flixhq.fetchMediaInfo(mediaID);
      console.log(res);
      return res;
    } catch (error) {
      attempts++;
      console.error(
        `Error getting media info : ${mediaID} -> ${attempts}/${maxRetries})`
      );
      if (attempts < maxRetries) {
        console.log(`Retrying in 1 second...`);
        await delay(1000);
      } else {
        console.error(`Failed to get media data after ${maxRetries} attempts.`);
      }
    }
  }
};

export const getEpiosdeSources = async (
  mediaID: string,
  episodeID: string,
  maxRetries: number = 50
) => {
  let attempts = 0;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < maxRetries) {
    try {
      const res = await flixhq.fetchEpisodeSources(episodeID, mediaID);
      console.log(res);
      return res;
    } catch (error) {
      attempts++;
      console.error(
        `Error getting media ${mediaID} for episode ${episodeID} -> ${attempts}/${maxRetries})`
      );
      if (attempts < maxRetries) {
        console.log(`Retrying in 1 second...`);
        await delay(1000);
      } else {
        console.error(`Failed to get media data after ${maxRetries} attempts.`);
      }
    }
  }
};
