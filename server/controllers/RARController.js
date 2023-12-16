const Unrar = require("unrar");
const fs = require("fs");

/**
 * Extracts a JSON file from a RAR archive and saves it to the specified output directory.
 *
 * @param {string} rarFilePath - The path to the RAR file.
 * @param {string} outputDirectory - The directory where the extracted JSON file will be saved.
 * @returns {Promise<string>} A promise that resolves with the path to the extracted JSON file.
 * @throws {Error} If there is an issue with the extraction or no JSON file is found in the archive.
 */

const extractRAR = (rarFilePath, outputDirectory) => {
  return new Promise((resolve, reject) => {
    try {
      var archive = new Unrar(rarFilePath);
      archive.list(function (err, entries) {
        if (err) return reject(err);
        const fileName = outputDirectory + Date.now() + ".txt"; // storing as a .txt file (due to some time constraints and also facing some issue in storing .json)
        const jsonEntry = entries.find(
          (entry) =>
            entry.type.toString().toLowerCase() === "file" &&
            entry.name.endsWith(".json")
        );
        if (jsonEntry) {
          const stream = archive.stream(jsonEntry.name);
          let jsonChunks = [];
          stream.on("data", (chunk) => {
            jsonChunks.push(chunk);
          });
          stream.on("end", () => {
            const jsonString = Buffer.concat(jsonChunks).toString("utf8");
            fs.writeFileSync(fileName, jsonString, "utf8");
            resolve(fileName);
          });
          stream.on("error", (error) => reject(error));
        } else {
          reject("No JSON file found in the archive.");
        }
      });
    } catch (e) {
      console.error(e);
      reject(e);
    }
  });
};

module.exports = extractRAR;
