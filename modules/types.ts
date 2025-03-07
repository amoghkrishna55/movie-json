export type ResponseData = {
  id: string;
  title: string;
  description: string;
  image: string;
  cover: string;
  rating: number;
  releaseDate: string;
};

export type EpisodeData = {
  id: string;
  title: string;
  number: number;
  season: number;
};

export type SourceData = {
  url: string;
  quality: string;
};

export type SubtitleData = {
  lang: string;
  url: string;
};
