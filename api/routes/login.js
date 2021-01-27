const express = require('express');
const router = express.Router();
const dbCmd = require('../controllers/loginCtrl');
const schemaValidation = require('../Helpers/payloadValidation')
const schema = require('../Helpers/validationSchema')

router.post('/', function (req, res) {
    try {
        /* validate all mandatory fields */

        let UserID = req.body.UserID;
        let Password = req.body.Password;
        let loginData = { UserID, Password }
        let loginDataSchema = schema.login;
        schemaValidation.validateSchema(loginData, loginDataSchema, function (err, result) {
            if (err) {
                res.json({
                    "status": false,
                    "message": "Payload validation error",

                });
            } else {
                dbCmd.decryptPassword(Password, function (DecryptedPassword) {
                    loginData.Password = DecryptedPassword;
                    dbCmd.loginEntry(loginData, function (err, result) {
                        if (err) {
                            res.json({
                                "status": false,
                                "message": err

                            });
                        } else {
                            req.user = result.data;
                            req.session.user = result.data;
                            res.locals.user = result.data;
                            let data = result.data;
                            req.session.save(function (err, result) {
                                if (err) {
                                    res.json({
                                        "type": false,
                                        "Message": "Login Again"
                                    });
                                } else {
                                    res.json({
                                        "status": true,
                                        "data": data
                                    });
                                }
                            })

                        }
                    });
                })

            }
        })
    } catch (e) {
        res.json({
            "status": false,
            "message": "Something went wrong : " + e.name + " " + e.message,

        });
    }

});
module.exports = router;