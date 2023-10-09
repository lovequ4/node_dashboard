const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./configs/config');
const cors = require('cors');
const app = express();
const users = require('./routes/api/users')
const sensorData = require('./routes/api/sensor');

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

//body-parser
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//passport init 
app.use(passport.initialize());
require("./configs/passport")(passport);

app.use(cors());


app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});


//routes
app.use("/api/users",users);    
app.use("/api/sensor",sensorData)