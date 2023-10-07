const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./configs/config');
const user = require('./routes/api/user')

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'nodedashboarddb'
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });



app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
});

app.get('/test', (req, res) => {
    res.json('test')
})