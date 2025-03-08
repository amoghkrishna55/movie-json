"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateSubtitles = exports.populateSources = exports.populateEpisodes = exports.populateData = exports.checkEpisodeExists = void 0;
const db_1 = __importDefault(require("./db"));
const checkEpisodeExists = (episodeId) => __awaiter(void 0, void 0, void 0, function* () {
    let attempts = 0;
    const maxAttempts = 10;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while (attempts < maxAttempts) {
        const episode = yield db_1.default.episode.findUnique({
            where: { id: episodeId },
        });
        if (episode) {
            return true;
        }
        console.error(`Episode ${episodeId} not found, retrying in 3 seconds...`);
        attempts++;
        yield delay(3000);
    }
    return false;
});
exports.checkEpisodeExists = checkEpisodeExists;
const populateData = (response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield db_1.default.dATA.create({
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
    }
    catch (error) {
        console.error(error);
    }
});
exports.populateData = populateData;
const populateEpisodes = (episodes, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const episode = yield db_1.default.episode.create({
            data: {
                id: episodes.id,
                title: episodes.title,
                number: episodes.number,
                season: episodes.season,
                dataId: id,
            },
        });
        console.log("Created episode with id: " + episode.id);
    }
    catch (error) {
        console.error(error);
    }
});
exports.populateEpisodes = populateEpisodes;
const populateSources = (sources, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const source = yield db_1.default.sources.createMany({
            data: sources.map((source) => {
                return {
                    episodeId: id,
                    quality: source.quality,
                    url: source.url,
                };
            }),
        });
        console.log("Created source for episode: " + id);
    }
    catch (error) {
        console.error(error);
    }
});
exports.populateSources = populateSources;
const populateSubtitles = (subtitle, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subtitles = yield db_1.default.subtitles.createMany({
            data: subtitle.map((subtitle) => {
                return {
                    episodeId: id,
                    language: subtitle.lang,
                    url: subtitle.url,
                };
            }),
        });
        console.log("Created subtitles for episode: " + id);
    }
    catch (error) {
        console.error(error);
    }
});
exports.populateSubtitles = populateSubtitles;
