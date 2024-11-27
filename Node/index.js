const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const employeeRoutes = require('./routes/employee_management');
const userRoutes = require('./routes/user_management');

const DB_URL = "mongodb://admin:password@mongodb:27017/assignment2db?authSource=admin"
const app = express();
app.use(bodyParser.urlencoded({ extended : true}))
app.use(bodyParser.json())

mongoose.Promise = global.Promise;

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Successfully connected to the database mongoDB");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});

app.use('/', employeeRoutes);
app.use('/', userRoutes);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to Will's Assignment 2 for COMP3123</h1>")
});

app.listen(3000, () => {
    console.log("server is listening on port 3000")
})