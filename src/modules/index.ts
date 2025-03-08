import prisma from "./db";
import { ResponseData, EpisodeData, SourceData, SubtitleData } from "./types";

export const checkEpisodeExists = async (
  episodeId: string
): Promise<boolean> => {
  let attempts = 0;
  const maxAttempts = 10;
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  while (attempts < maxAttempts) {
    const episode = await prisma.episode.findUnique({
      where: { id: episodeId },
    });

    if (episode) {
      return true;
    }
    console.error(`Episode ${episodeId} not found, retrying in 3 seconds...`);
    attempts++;
    await delay(3000);
  }

  return false;
};

export const populateData = async (response: ResponseData) => {
  try {
    const data = await prisma.dATA.create({
      data: {
        id: response.id,
        title: response.title,
        description: response.description,
        image: response.image,
        cover: response.cover,
        type: response.type === "Movie" ? "MOVIE" : "TV_SHOW",
        rating: response.rating,
        releaseDate: new Date(response.releaseDate),
      },
    });
    console.log("Created data with id: " + data.id);
  } catch (error) {
    console.error(error);
  }
};

export const populateEpisodes = async (episodes: EpisodeData, id: string) => {
  try {
    const episode = await prisma.episode.create({
      data: {
        id: episodes.id,
        title: episodes.title,
        number: episodes.number,
        season: episodes.season,
        dataId: id,
      },
    });
    console.log("Created episode with id: " + episode.id);
  } catch (error) {
    console.error(error);
  }
};

export const populateSources = async (sources: SourceData[], id: string) => {
  try {
    const source = await prisma.sources.createMany({
      data: sources.map((source) => {
        return {
          episodeId: id,
          quality: source.quality,
          url: source.url,
        };
      }),
    });
    console.log("Created source for episode: " + id);
  } catch (error) {
    console.error(error);
  }
};

export const populateSubtitles = async (
  subtitle: SubtitleData[],
  id: string
) => {
  try {
    const subtitles = await prisma.subtitles.createMany({
      data: subtitle.map((subtitle) => {
        return {
          episodeId: id,
          language: subtitle.lang,
          url: subtitle.url,
        };
      }),
    });
    console.log("Created subtitles for episode: " + id);
  } catch (error) {
    console.error(error);
  }
};
