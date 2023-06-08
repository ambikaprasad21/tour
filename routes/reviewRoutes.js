const express = require('express'); //for creating a route we need to use express so we are requiring express
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

const router = express.Router({ mergeParams: true }); //this is used to create routes
//mergeParams: true is done because the reviewRouter has no tourId but in tourRoutes we have passes a tourId there so to get access to the tourId we need to give mergeParams

//POST /tour/5649468aava/reviews
//GET /tour/3687984654sag/reviews
//POST /reviews

//Protecting all the below routes.
router.use(authController.protect);

//**we will mount this router on api/reviews */
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserId,
    reviewController.createReview
  ); //here we used the protect controller from authController that will allow only authenticated user to post a review

router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview
  ) //restricting delete to only user and admin
  .patch(
    authController.restrictTo('user', 'admin'), //restrincting patch to only user and admin
    reviewController.updateReview
  );
module.exports = router;
