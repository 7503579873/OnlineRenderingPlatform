const express = require('express');
const router = express.Router();
const dbCmd = require('../controllers/getUserCtrl');
const schemaValidation = require('../Helpers/payloadValidation')
const schema = require('../Helpers/validationSchema')

const authenticateJWT = require('../../api/middleware/check-auth');



router.get('/', function (req, res) {
    try {
        /* validate all mandatory fields */

        let UserID = req.headers.userid;
        let userDetails = { UserID }
        let userDetailsSchema = schema.userDetails;
        authenticateJWT.authentication(req, function (err, result) {
            if (result) {
                schemaValidation.validateSchema(userDetails, userDetailsSchema, function (err, result) {
                    if (err) {
                        res.json({
                            "status":false,
                            "message": "Payload validation error"                     
                        });
                    } else {
                        dbCmd.getUserDetails(UserID, function (err, result) {
                            if (err) {
                                res.json({
                                    "status":err,
                                    "message": result                     
                                });
                            } else {
                                res.json({
                                    "status":true,
                                    "message": result                     
                                });
                            }
                        });
                    }
                })
            } else {
                res.json({
                    "status":false,
                    "message": err                     
                });
            }
        });
    } catch (e) {
        res.json({
            "status": false,
            "message": "Something went wrong : " + e.name + " " + e.message
            
    });
    }

});
module.exports = router;