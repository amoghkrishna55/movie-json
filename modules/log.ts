import fs from "node:fs";
import path from "node:path";

export const saveLog = (log: string, fileName: string) => {
  const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const filePath = path.join(__dirname, "../logs", `${fileName}.txt`);

  fs.mkdir(path.dirname(filePath), { recursive: true }, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    fs.appendFile(filePath, log, { flag: "a" }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  });
};
