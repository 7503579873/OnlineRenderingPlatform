const Joi = require('@hapi/joi');

const SignUp = Joi.object().keys({
  FirstName: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").min(1).max(30).regex(/^[a-zA-Z0-9\-\s]+$/),
  LastName: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").min(1).max(30).regex(/^[a-zA-Z0-9\-\s]+$/),
  MobileNo: Joi.string().required().invalid('null', 'undefined', true, false, "true", "false").regex(/^[-+]?[0-9]+[-+]?[0-9]+$/).min(10).max(19),
  Email: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").regex(/^[_a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,4})$/),
  Password: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false"),
}).required();

const updateUser = Joi.object().keys({
  ConsumerID: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").min(1).max(20).regex(/^[a-zA-Z0-9\\s]+$/),
  FirstName: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").min(1).max(30).regex(/^[a-zA-Z0-9\-\s]+$/),
  LastName: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").min(1).max(30).regex(/^[a-zA-Z0-9\-\s]+$/),
})

const userDetails = Joi.object().keys({
  UserID: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").min(1).max(20).regex(/^[a-zA-Z0-9\\s]+$/),
}).required();

const login = Joi.object().keys({
  UserID: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false").min(1).max(20).regex(/^[a-zA-Z0-9\\s]+$/),
  Password: Joi.string().required().trim().invalid('null', 'undefined', true, false, "true", "false"),
}).required();





module.exports = {
  SignUp: SignUp,
  login:login,
  userDetails:userDetails,
  updateUser:updateUser
  
}
