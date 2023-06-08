const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');
// const app = require('./../app');
const router = express.Router();

//router.use(authController.isLoggedIn); //this middleware will be runned before running the below routes, we are commenting out this middleware because we want to implement the protect middleware in me route

router.get('/signup', viewsController.getSignupForm);
router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
