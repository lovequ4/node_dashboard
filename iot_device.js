const SensorData = require('./models/sensor');
const mongoose = require('mongoose');
const config = require("./configs/config");
const mqtt = require('mqtt');
const faker = require('faker');
const brokerUrl = 'mqtt://localhost'; 
const topic = 'iot-device-data';

const client = mqtt.connect(brokerUrl);


mongoose.connect(config.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: config.DB
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});



client.on('connect', () => {
  console.log('connect mqtt success');

  setInterval(async () => {
    const sensorData = {
      temperature: faker.datatype.number({ min: -20, max: 40 }),
      humidity: faker.datatype.number({ min: 20, max: 80 }),
    };

    
    client.publish(topic, JSON.stringify(sensorData));
      console.log('Data sent:', sensorData);

    try {
      const newData = new SensorData(sensorData);
      await newData.save();
      console.log('Data saved to MongoDB');
    } catch (error) {
      console.error(error);
    }

  }, 5000);
});

client.on('error', (error) => {
  console.error('error:', error);
});

