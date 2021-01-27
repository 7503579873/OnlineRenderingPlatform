//REQUIRED PACKAGES AND FILES.
var dbCon = require('./dbConnection.js');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const config = require("../config/configParams.js").config;
const cofigParam = JSON.parse(JSON.stringify(config))

/**
* @description - For the Webservice  - login entry     Desc - login user details IN MONGODB   
* @params data i.e userID,  Password, callback
* @return callback function
*/
function loginEntry(data, callback) {
    dbCon.getDb(function (err, db) {
        if (err) {
            callback(err, null);
        }
        else
            loginEntryFromMongoDB(db.orp_User, callback);
    });
};


/**
* @description -  login consumer
* @param , userCollection, data i.e UserID, Password, callback
* @return callback function
*/

function loginEntryFromMongoDB(userCollection, callback) {
    try {
        let data;
        // check whether UserID/ Password is correct or not
        userCollection.findOne({ UserID: loginData.UserID }, { Password: 0, OldPasswords: 0, PasswordAssignedTimestamp: 0 }, function (err, result) {
            if (err) {
                return callback(err, null);
            }
            else if (!result) {
                return callback("Wrong Username/Password", null);
            } else {

                comparePassword(loginData.Password, result.Password, function (err, isPasswordMatch) {
                    if (err) {
                        return callback(err, null);
                    }
                    else if (!isPasswordMatch) {
                        return callback("Wrong Username/Password", null);
                    } else {
                        var tokenExpiryTime = parseInt(cofigParam['JWTAccessToken']['ExpiryTime']);
                        var accessToken = jwt.sign({ "UserID": loginData.ConsumerID, "exp": Math.floor(Date.now()) + tokenExpiryTime }, cofigParam['JWTAccessToken']['SecretKey']);
                        delete result.Password;
                        delete result.PasswordAssignedTimestamp;
                        delete result.OldPasswords;
                        result.accessToken = accessToken;
                        userCollection.update({ "UserID": loginData.ConsumerID }, { "$set": { "accessToken": accessToken, "DeviceToken": loginData.DeviceToken, "DevicePlatform": loginData.DevicePlatform } }, function (err, insertResponse) {
                            if (err) {
                                let errordata = { message: "Database error occured", responseCode: "300" }
                                callback(errordata, null);
                            }
                            else {
                                userCollection.findOne({ UserID: loginData.ConsumerID }, { Password: 0, OldPasswords: 0, PasswordAssignedTimestamp: 0 }, function (err, result) {
                                    if (err) {
                                        return callback(err, null);
                                    }
                                    else if (!result) {
                                        return callback("Wrong Username/Password", null);
                                    } else {
                                        delete result.Password;
                                        delete result.PasswordAssignedTimestamp;
                                        delete result.OldPasswords;
                                        data = { data: result, message: "Successfully login", responseCode: "200" }
                                        callback(null, result);

                                    }
                                })
                            }
                        });




                    }
                });

            }
        })

    } catch (e) {
        callback({ message: "Something went wrong : " + e.name + " " + e.message, responseCode: "315" }, null)
    }
}






/**
* @description - decrypt encrypted text
*
* @param encryptedString  - encryptedtext
*
* @return callback function.
*/
function decryptPassword(encryptedString, callback) {
    var buff = Buffer.from(encryptedString, 'base64');
    var decryptedString = buff.toString('ascii');
    callback(decryptedString);
};


/**
* @description - compare Password 
* @param password
* @param hashPassword
* @param callback - callback function returns success or error response
* @return callback function
*/
function comparePassword(password, hashPassword, callback) {
    bcrypt.compare(password, hashPassword, function (err, isPasswordMatch) {
        if (err)
            return callback(err, null);
        return callback(null, isPasswordMatch);
    });
};



module.exports = {
    loginEntry: loginEntry,
    decryptPassword: decryptPassword,
}