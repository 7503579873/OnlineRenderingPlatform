//REQUIRED PACKAGES AND FILES.
var dbCon = require('../models/dbConnection');
var shortid = require('shortid');
var bcrypt = require('bcrypt');


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
* @description - For the Webservice -  - signUpEntry     Desc - Add User details IN MONGODB   
* @params data i.e MobileNo, Email, Password, callback
* @return callback function
*/
function signUpEntry(data, callback) {
    dbCon.getDb(function (err, db) {
        if (err) {
            callback(err, null);
        }
        else
            signUpEntryFromMongoDB(db.ORP_User, data, callback);
    });
};


/**
* @description -  signup new user
* @param , userCollection, data i.e , MobileNo, Email, Password, callback
* @return callback function
*/

function signUpEntryFromMongoDB(userCollection, signupData, callback) {
    try {
        var storedPassword = [];
        let data;
        cryptPassword(signupData.Password, function (err, hashPassword) {
            if (err) {
                callback(err, null);
            }
            else {
                storedPassword.push(hashPassword);
                var loginID = shortid.generate();
                var user = {
                    "LoginID": loginID,
                    "EmailAddress": signupData.Email,
                    "Password": hashPassword,
                    "PasswordAssignedTimestamp": new Date(),
                    "OldPasswords": storedPassword,
                    "UserID": signupData.Email,
                    "MobileNo": signupData.MobileNo,
                    "FirstName": signupData.FirstName,
                    "LastName": signupData.LastName,
                };

                userCollection.find({ $and: [{ $or: [{ EmailAddress: signupData.Email }, { UserID: signupData.ConsumerID }] }] }).toArray(function (err, res) {
                    if (err) {
                        return callback(err, null);
                    }
                    else {
                        if (res.length > 0) {
                            callback("Email/UserID already registered", null);
                        } else {
                            userCollection.insertOne(user, function (err, resp) {
                                if (err) {
                                    callback(err, null);
                                }
                                else {
                                    callback(null, "User registered successfully")
                                }
                            })
                        }
                    }
                })



            }
        })
    } catch (e) {
        callback(`Something went wrong : " ${e.name} " " ${e.message}`, null)
    }
}


/**
* @description -  crypt Password
* @param password 
* @param callback - callback function returns success or error response
* @return callback function
*/
function cryptPassword(password, callback) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            return callback(err, null);

        bcrypt.hash(password, salt, function (err, hash) {
            return callback(err, hash);
        });

    });
};




module.exports = {
    signUpEntry: signUpEntry,
    decryptPassword: decryptPassword,
}