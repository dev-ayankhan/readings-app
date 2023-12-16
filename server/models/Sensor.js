const mongoose = require("mongoose");

const SensorSchema = mongoose.Schema({
  serial: {
    type: String,
    required: true,
  },
});

const Sensor = mongoose.model("Sensor", SensorSchema);

module.exports = Sensor;
