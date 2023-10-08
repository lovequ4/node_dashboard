const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorDataSchema = new Schema({
    temperature: Number,
    humidity: Number,
    timestamp: { type: Date, default: Date.now }
})

module.exports = SensorData = mongoose.model('sensordata', SensorDataSchema);