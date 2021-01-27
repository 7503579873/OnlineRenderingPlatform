//REQUIRED PACKAGES AND FILES.
var dbCon = require('./dbConnection.js');


/**
* @description - For the Webservice -  - Get User Details     Desc - get details by  UserID IN MONGODB   
* @params data i.e UserID, Email, callback
* @return callback function
*/
function getUserDetails(UserID, callback) {
    dbCon.getDb(function (err, db) {
        if (err) {
            callback("Database error occured", null);
        }
        else
            getUserDetailsFromMongoDB(db.orp_User, UserID, callback);
    });
};



/**
* @description -   For the Webservice -  - Get User Details     Desc - get details by  UserID IN MONGODB  
* @param , userCollection, UserID callback
* @return callback function
*/

function getUserDetailsFromMongoDB(userCollection, ConsumerID, callback) {
    try {
        userCollection.find({ "UserID": UserID }).toArray(function (err, result) {
            if (err) {
                callback("Database error occured", null);
            }
            else {
                if (result.length) {

                    let getDetails =
                    {
                        "UserID": UserID,
                        "Email": result[0].EmailAddress,
                        "FirstName": result[0].FirstName,
                        "LastName": result[0].LastName,
                        "MobileNo": result[0].MobileNo,
                        "Country": res[0].Meters_Billing.MeterConsumerCountry,
                        "Address": res[0].Meters_Billing.MeterConsumerAddress,
                        "State": res[0].Meters_Billing.MeterConsumerState,
                        "City": res[0].Meters_Billing.MeterConsumerCity,
                        "ZipCode": res[0].Meters_Billing.MeterConsumerZipCode,
                    }
                    callback(null, getDetails)

                } else {
                    callback("UserID not available", null)

                }
            }
        })
    } catch (e) {
        callback("Something went wrong : " + e.name + " " + e.message, null)
    }
}


module.exports = {
    getUserDetails: getUserDetails
}