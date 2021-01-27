const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var sessioncheck = require('./api/routes/sessionCheck');

const app = express();

// Use body parser middleware to parse body of incoming requests
app.use(bodyParser.urlencoded({ extended: true, limit: '40mb' }));
app.use(bodyParser.json({ limit: '40mb' }));



var mongoHost = process.env.mongoHost || 'localhost';
var port = process.env.port || '27017'
var mongoDB = process.env.mongoDB || 'ORP';
var mongoUser = process.env.mongoUser || null;
var mongoUserPass = process.env.mongoUserPass || null;
var socketTimeoutMS = process.env.socketTimeoutMS || 35000;
var maxPoolSize = process.env.maxPoolSize || 100;

var sess = {
    secret: 'XXXX-XXXX-XXXXXX',
    cookie: { httpOnly: false },
    store: new MongoStore({
        //  url: "mongodb://" + mongoUser + ":" + mongoUserPass + "@" + mongoHost + "/" + mongoDB + "?authSource=admin&connectTimeoutMS=300000",
        url: "mongodb://localhost:27017/ORP",
        ttl: 15 * 60
    }),
    saveUninitialized: true,
    resave: true,
    maxAge: 900000 //15 Minutes
}
app.use(session(sess))

// Setup CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    }
    if (req.sessionID) {
        sessioncheck.findUser(req.sessionID, function (err, session) {
            if (err) {
                req.session.destroy(function (err, success) {
                    res.json({
                        "status": false,
                        "message": "Login First",

                    });
                });
            } else
                next();
        });

    } else {
        next();
    }
});


const signup = require('./api/routes/signup');
const login = require('./api/routes/login');
const getUserDetails = require('./api/routes/getUserDetails');
const editUser = require('./api/routes/editUser');
const deleteUser = require('./api/routes/deleteUser');
const addItem = require('./api/routes/addItem');
const editItem = require('./api/routes/editItem');
const deleteItem = require('./api/routes/deleteItem');
const getItemDetails = require('./api/routes/getItemDetails');
const getItemDetailsByUserID = require('./api/routes/getItemDetailsByUserID');
const orderRoutes = require('./api/routes/orders');


// Routes which should handle requests
app.use('/signup', signup);
app.use('/login', login);
app.use('/getUserDetails', getUserDetails);
app.use('/editUser', editUser);
app.use('/deleteUser', deleteUser)
app.use('/addItem', addItem)
app.use('/editItem', editItem);
app.use('/deleteItem', deleteItem);
app.use('/getItemDetails', getItemDetails);
app.use('/getItemDetailsByUserID', getItemDetailsByUserID);
app.use('/orders', orderRoutes);


module.exports = app;