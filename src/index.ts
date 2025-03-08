#!/usr/bin/env node

import prompts from "prompts";
import { getInfo } from "./main";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const CLI_NAME = "fluxity";
const CLI_VERSION = "1.0.0";

const envFilePath = path.resolve(__dirname, "../.env");

async function promptForURL() {
  if (!process.env.consumetURL) {
    const urlResponse = await prompts({
      type: "text",
      name: "consumetURL",
      message: "Enter the Consumet API URL:",
    });

    const consumetURL = urlResponse.consumetURL;

    if (!fs.existsSync(envFilePath)) {
      fs.writeFileSync(envFilePath, "");
    }

    fs.appendFileSync(envFilePath, `consumetURL=${consumetURL}\n`);

    dotenv.config();
  }
}

async function searchMovie(movieName: string) {
  console.log(`Searching for movie: ${movieName}...`);
  return ["Movie 1", "Movie 2", "Movie 3"];
}

async function main() {
  let boolAPI = true;
  console.log(`${CLI_NAME} v${CLI_VERSION}`);

  const response = await prompts({
    type: "confirm",
    name: "proceed",
    message: "Do you want to fetch movie details?",
    initial: true,
  });

  if (!response.proceed) {
    console.log("Exiting CLI...");
    return;
  }

  const sourceResponse = await prompts({
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
  } else {
    if (process.env.consumetURL === undefined) {
      await promptForURL();
    }
  }

  const actionResponse = await prompts({
    type: "select",
    name: "action",
    message: "Choose an action:",
    choices: [
      { title: "Search Movie", value: "search" },
      { title: "Fetch by ID", value: "fetchById" },
    ],
  });

  if (actionResponse.action === "search") {
    const movieInput = await prompts({
      type: "text",
      name: "movieName",
      message: "Enter the movie name:",
    });

    if (!movieInput.movieName.trim()) {
      console.log("Invalid movie name. Exiting...");
      return;
    }

    const searchResults = await searchMovie(movieInput.movieName);
    console.log("Search results:", searchResults);
  } else if (actionResponse.action === "fetchById") {
    const idInput = await prompts({
      type: "text",
      name: "movieId",
      message: "Enter the movie ID:",
    });

    if (!idInput.movieId.trim()) {
      console.log("Invalid movie ID. Exiting...");
      return;
    }

    console.log(`Fetching movie with ID: ${idInput.movieId}...`);

    await getInfo(idInput.movieId);
  }
}

main();
