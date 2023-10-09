const express = require('express');
const router = express.Router();
const SensorData = require("../../models/sensor");


router.get("/",async (req,res)=>{
  try {
    const sensorData = await SensorData.find();

    if(sensorData.length === 0){
        return res.status(404).json({ message: 'No Sensor Data found' })
    }
    res.json(sensorData);
  } catch (error) { 
        console.log(error)
        res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;