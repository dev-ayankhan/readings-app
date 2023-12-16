const mongoose = require("mongoose");

const ReadingSchema = mongoose.Schema(
  {
    timestamp: {
      type: Number,
      required: true,
    },
    temperature: {
      type: Number,
      required: true,
    },
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensor",
    },
  },
  {
    timestamps: false,
  }
);

const Reading = mongoose.model("Reading", ReadingSchema);

module.exports = Reading;
