const express = require('express');
const router = express.Router();
const dbCmd = require('../controllers/editItemCtrl');
const schemaValidation = require('../Helpers/payloadValidation')
const schema = require('../Helpers/validationSchema')

router.post('/', function (req, res) {
    try {
        /* validate all mandatory fields */
                let MobileNo = req.body.MobileNo;
                let Email = req.body.Email;
                let Password = req.body.Password;
                let FirstName = req.body.FirstName;
                let LastName = req.body.LastName;
                let signUpData = {  MobileNo, Email, Password, FirstName, LastName }
                let signUpSchema = schema.SignUp;
                schemaValidation.validateSchema(signUpData, signUpSchema, function (err, result) {
                    if (err) {
                        res.json({
                            "status":false,
                            "message": "Payload validation error"                         
                        });
                    } else {
                        dbCmd.decryptPassword(Password, function (DecryptedPassword) {
                            signUpData.Password = DecryptedPassword;
                            dbCmd.signUpEntry(signUpData, function (err, result) {
                                if (err) {
                                    res.json({
                                        "status":false,
                                        "message": err                       
                                    });
                                } else {
                                    res.json({
                                        "status":true,
                                        "message": result                     
                                    });
                                }
                            });
                        })

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