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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEpiosdeSources = exports.getMediaInfo = exports.searchMedia = void 0;
const extensions_1 = require("@consumet/extensions");
const flixhq = new extensions_1.MOVIES.FlixHQ();
const searchMedia = (mediaID_1, ...args_1) => __awaiter(void 0, [mediaID_1, ...args_1], void 0, function* (mediaID, maxRetries = 50) {
    let attempts = 0;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while (attempts < maxRetries) {
        try {
            const res = yield flixhq.search(mediaID, 1);
            console.log(res);
            return res;
        }
        catch (error) {
            attempts++;
            console.error(`Error searching for media : ${mediaID} -> ${attempts}/${maxRetries}`);
            if (attempts < maxRetries) {
                console.log(`Retrying in 1 second...`);
                yield delay(1000);
            }
            else {
                console.error(`Failed to search for media after ${maxRetries} attempts.`);
            }
        }
    }
});
exports.searchMedia = searchMedia;
const getMediaInfo = (mediaID_1, ...args_1) => __awaiter(void 0, [mediaID_1, ...args_1], void 0, function* (mediaID, maxRetries = 50) {
    let attempts = 0;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while (attempts < maxRetries) {
        try {
            const res = yield flixhq.fetchMediaInfo(mediaID);
            console.log(res);
            return res;
        }
        catch (error) {
            attempts++;
            console.error(`Error getting media info : ${mediaID} -> ${attempts}/${maxRetries})`);
            if (attempts < maxRetries) {
                console.log(`Retrying in 1 second...`);
                yield delay(1000);
            }
            else {
                console.error(`Failed to get media data after ${maxRetries} attempts.`);
            }
        }
    }
});
exports.getMediaInfo = getMediaInfo;
const getEpiosdeSources = (mediaID_1, episodeID_1, ...args_1) => __awaiter(void 0, [mediaID_1, episodeID_1, ...args_1], void 0, function* (mediaID, episodeID, maxRetries = 50) {
    let attempts = 0;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    while (attempts < maxRetries) {
        try {
            const res = yield flixhq.fetchEpisodeSources(episodeID, mediaID);
            console.log(res);
            return res;
        }
        catch (error) {
            attempts++;
            console.error(`Error getting media ${mediaID} for episode ${episodeID} -> ${attempts}/${maxRetries})`);
            if (attempts < maxRetries) {
                console.log(`Retrying in 1 second...`);
                yield delay(1000);
            }
            else {
                console.error(`Failed to get media data after ${maxRetries} attempts.`);
            }
        }
    }
});
exports.getEpiosdeSources = getEpiosdeSources;
