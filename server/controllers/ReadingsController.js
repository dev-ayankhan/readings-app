const fs = require("fs");
const readline = require("readline");
const Sensor = require("../models/Sensor");

const extractRAR = require("./RARController");
const Helper = require("./HelperController");
const Reading = require("../models/Reading");

class ReadingsController extends Helper {
  main = (res, filePath, serial, extractDir) => {
    extractRAR(filePath, extractDir)
      .then(async (data) => {
        await this.readBatch(serial, data);
        return this.__return(
          res,
          200,
          "file uploading and extraction complete"
        );
      })
      .catch((error) => {
        console.log(error);
        return this.__return(res, 500);
      });
  };

  /**
   * Read the contents of a file.
   *
   * @param {string} filePath - The path to the file to be read (a .txt file that we extracted from the .rar).
   * @returns {Promise<string>} A promise that resolves with the contents of the file as a string.
   */

  readBatch = async (serial, filePath) => {
    var sensor = await Sensor.findOne({ serial: serial });
    if (!sensor) {
      sensor = new Sensor({ serial: serial });
      await sensor.save();
    }
    const readStream = fs.createReadStream(filePath, "utf8");
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });
    let jsonData = "";
    rl.on("line", (line) => {
      jsonData += line;
    });
    rl.on("close", async () => {
      try {
        var data = JSON.parse(jsonData);
        var readings = [];
        data.map((readingData) => {
          if (readingData?.ts && readingData?.val) {
            readings.push({
              sensorId: sensor._id,
              timestamp: readingData?.ts,
              temperature: readingData?.val,
            });
          }
        });
        await this.insertInBatches(readings, 100);
        console.log("file reading and writing to db completed.");
      } catch (parseError) {
        console.error("error parsing JSON:", parseError);
      }
    });
    readStream.on("error", (error) => {
      console.error("error reading file:", error);
    });
  };

  /**
   * Converts the complete data set into multiple batches and process.
   * 
   * @param {array} data -The complete data array to be converted into batches.
   * @param {number} batchSize - The batch size.
   */

  insertInBatches = async (data, batchSize) => {
    const collection = await Reading.createCollection();
    let bulk = collection.initializeOrderedBulkOp();
    let count = 0;
    try {
      for (const doc of data) {
        bulk.insert(doc);
        count++;
        if (count % batchSize === 0) {
          await bulk.execute();
          bulk = collection.initializeOrderedBulkOp();
        }
      }
      if (count % batchSize !== 0) {
        await bulk.execute();
      }
    } catch (e) {
      console.log(e);
    }
  };

  getReadings = async (res, serial) => {
    var sensor = await Sensor.findOne({ serial: serial });
    if (!sensor) return this.__return(res, 400, "sensor not found");
    const data = await Reading.aggregate([
      {
        $addFields: {
          convertedDate: {
            $toDate: "$timestamp",
          },
          month: {
            $month: {
              $toDate: "$timestamp",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$convertedDate" },
            month: "$month",
          },
          minValue: { $min: "$temperature" },
          maxValue: { $max: "$temperature" },
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          minValue: 1,
          maxValue: 1,
        },
      },
      {
        $sort: {
          year: 1,
          month: 1,
        },
      },
    ]).exec();
    return this.__return(res, 200, "data fetched successfully", data);
  };
}

module.exports = ReadingsController;
