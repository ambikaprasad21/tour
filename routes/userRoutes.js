const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//Putting all the routHandler to other file called userController.js
// const getAllUsers = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     //500 is for internal server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const getUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const updateUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

// const deleteUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build',
//   });
// };

router.post('/signup', authController.signup);

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword); //forgotPassword will receive only the email address
router.patch('/resetPassword/:token', authController.resetPassword); //resetPassword will receive the token and the new password, here token is the parameter

//protect all routes after this middleware
router.use(authController.protect); //all the middleware that are below this code are now protected, because middleware works in stack
//so we can go and remove all the protect from below middleware as we have used router.use(authcontroller.protect) above which will work for all the middleware that are below

router.patch('/updateMyPassword', authController.updatePassword); //here patch is used becuase we are manupulating the user.

router.get('/me', userController.getMe, userController.getUser);
router.patch(
  '/updateMe',

  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
); //using upload to create a new middleware with photo field
router.delete('/deleteMe', userController.deleteMe); //we will not delete the user permanently from database

//restrincting all the below routes to only admin.
router.use(authController.restrictTo('admin'));

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id') //here id is the parameter
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
