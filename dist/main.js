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
exports.getInfo = exports.getEpisodes = void 0;
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
const index_1 = require("./modules/index");
(0, axios_retry_1.default)(axios_1.default, {
    retries: 50,
    retryDelay: (retryCount) => {
        return 1000;
    },
    onRetry: (retryCount, error, requestConfig) => {
        console.error(`Retry attempt #${retryCount} for request: ${requestConfig.url}`);
    },
});
const getEpisodes = (dataJson) => __awaiter(void 0, void 0, void 0, function* () {
    for (let i = 0; i < dataJson.episodes.length; i++) {
        console.log(`Fetching data for ${dataJson.episodes[i].id} -> ${i + 1} / ${dataJson.episodes.length}`);
        try {
            let { data } = yield axios_1.default.get(`${process.env.consumetURL}/movies/flixhq/watch?episodeId=${dataJson.episodes[i].id}&mediaId=${dataJson.id}`);
            (0, index_1.populateEpisodes)(dataJson.episodes[i], dataJson.id);
            const status = yield (0, index_1.checkEpisodeExists)(dataJson.episodes[i].id);
            if (status) {
                (0, index_1.populateSources)(data.sources, dataJson.episodes[i].id);
                (0, index_1.populateSubtitles)(data.subtitles, dataJson.episodes[i].id);
            }
            else {
                console.error(`Resources for episode ${dataJson.episodes[i].id} could not be populated`);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
});
exports.getEpisodes = getEpisodes;
const getInfo = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { data } = yield axios_1.default.get(`${process.env.consumetURL}/movies/flixhq/info?id=${id}`);
        (0, index_1.populateData)(data);
        (0, exports.getEpisodes)(data);
    }
    catch (error) {
        console.error(error);
    }
});
exports.getInfo = getInfo;
// getInfo("movie/watch-fight-club-19651");
