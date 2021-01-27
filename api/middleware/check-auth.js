
const jwt = require('jsonwebtoken');
let fs = require('fs');
var dbCon = require('../models/dbConnection');
const config = require("../config/configParams.js").config;
const cofigParam = JSON.parse(JSON.stringify(config))

function authentication(req, callback) {
    const token = req.headers.authorization;
    const userID = req.headers.userid;

    if (token) {
        verifyJwt(token, userID, callback);
    } else {
        callback("No token found", null);
    }

}

function verifyJwt(token, UserID, callback) {
    var accessTokenSecret = cofigParam['JWTAccessToken']['SecretKey']
    jwt.verify(token, accessTokenSecret, (err, user) => {
        if (err) {
            callback("Invalid token", null);
        } else {
            if (user.UserID == UserID) {
                if (user.exp < Date.now()) {
                    callback("Invalid token", null);
                }
                else {
                    dbCon.getDb(function (err, db) {
                        if (err) {
                            callback("Database error occured", null);
                        } else {
                            var collectionName = db.ORP_User;
                            collectionName.findOne({ "UserID": UserID, "accessToken": token }, function (error, result) {
                                if (error) {
                                    callback("Database error occured", null);
                                }
                                else {
                                    if (!result)
                                        callback("Invalid token", null);
                                    else
                                        callback(null, "Success");

                                }
                            });
                        }
                    });
                }
            } else
                callback("Invalid token for this User", null)
        }
    });
}

module.exports = {
    authentication: authentication
}