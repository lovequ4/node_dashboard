const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require("../../configs/config");
const SensorData = require("../../models/sensor");


router.get("/",(req,res)=>{
    SensorData.find()
        .then(sensor=>{
            if(!sensor){
                return res.status(404).json("No Sensor Data");
            }
            res.json(sensor);
        })
        .catch((err) => res.status(400).json(err)); 
})


module.exports = router;