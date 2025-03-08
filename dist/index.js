#!/usr/bin/env node
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
const prompts_1 = __importDefault(require("prompts"));
const main_1 = require("./main");
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const CLI_NAME = "fluxity";
const CLI_VERSION = "1.0.0";
const envFilePath = path_1.default.resolve(__dirname, "../.env");
function promptForURL() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.consumetURL) {
            const urlResponse = yield (0, prompts_1.default)({
                type: "text",
                name: "consumetURL",
                message: "Enter the Consumet API URL:",
            });
            const consumetURL = urlResponse.consumetURL;
            if (!fs_1.default.existsSync(envFilePath)) {
                fs_1.default.writeFileSync(envFilePath, "");
            }
            fs_1.default.appendFileSync(envFilePath, `consumetURL=${consumetURL}\n`);
            dotenv_1.default.config();
        }
    });
}
function searchMovie(movieName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Searching for movie: ${movieName}...`);
        return ["Movie 1", "Movie 2", "Movie 3"];
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let boolAPI = true;
        console.log(`${CLI_NAME} v${CLI_VERSION}`);
        const response = yield (0, prompts_1.default)({
            type: "confirm",
            name: "proceed",
            message: "Do you want to fetch movie details?",
            initial: true,
        });
        if (!response.proceed) {
            console.log("Exiting CLI...");
            return;
        }
        const sourceResponse = yield (0, prompts_1.default)({
            type: "select",
            name: "source",
            message: "Fetch data from:",
            choices: [
                { title: "Deployed API", value: "api" },
                { title: "On Device", value: "device" },
            ],
        });
        if (sourceResponse.source === "device") {
            boolAPI = false;
        }
        else {
            if (process.env.consumetURL === undefined) {
                yield promptForURL();
            }
        }
        const actionResponse = yield (0, prompts_1.default)({
            type: "select",
            name: "action",
            message: "Choose an action:",
            choices: [
                { title: "Search Movie", value: "search" },
                { title: "Fetch by ID", value: "fetchById" },
            ],
        });
        if (actionResponse.action === "search") {
            const movieInput = yield (0, prompts_1.default)({
                type: "text",
                name: "movieName",
                message: "Enter the movie name:",
            });
            if (!movieInput.movieName.trim()) {
                console.log("Invalid movie name. Exiting...");
                return;
            }
            const searchResults = yield searchMovie(movieInput.movieName);
            console.log("Search results:", searchResults);
        }
        else if (actionResponse.action === "fetchById") {
            const idInput = yield (0, prompts_1.default)({
                type: "text",
                name: "movieId",
                message: "Enter the movie ID:",
            });
            if (!idInput.movieId.trim()) {
                console.log("Invalid movie ID. Exiting...");
                return;
            }
            console.log(`Fetching movie with ID: ${idInput.movieId}...`);
            yield (0, main_1.getInfo)(idInput.movieId);
        }
    });
}
main();
