const express = require('express');
const passport = require('passport');
const router = express.Router();

//controller
const registerController = require('./../../http/controllers/auth/registerController')
const loginController = require('./../../http/controllers/auth/loginController')
const forgetPasswordController = require('app/http/controllers/auth/forgetPasswordController')
const resetPasswordController = require('./../../http/controllers/auth/resetPasswordController')

//validatore
const registerValidator = require('app/http/validators/registerValidator');
const loginValidator = require('../../http/validators/loginValidator');
const forgetPasswordValidator = require('app/http/validators/forgetPasswordValidator');
const resetPasswordValidator = require('app/http/validators/resetPasswordValidator');

//Register
router.get('/register', registerController.showForm)
router.post('/register', registerValidator.handle(), registerController.registerProcess)

//login
router.get('/login', loginController.showForm)
router.post('/login', loginValidator.handle(), loginController.loginProcess)

// Google auth
router.get('/google', passport.authenticate('google', {scope : ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {successRedirect : '/', failureRedirect : '/auth/login'}));

// password reset
router.get('/password/reset' , forgetPasswordController.showForm);
router.post('/password/email', forgetPasswordValidator.handle(), forgetPasswordController.passwordResetLink);
router.get('/password/reset/:token', resetPasswordController.showForm);
router.post('/password/reset', resetPasswordValidator.handle(), resetPasswordController.resetPasswordProcess);



module.exports = router;