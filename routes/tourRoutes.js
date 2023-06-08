const express = require('express');

const tourController = require('./../controllers/tourController'); //-->here tourControlle will contain all the exports data so to have access of every function we need to use tourController.functionName
const authController = require('./../controllers/authController');
//const reveiwController = require('./../controllers/reviewController'); //requiring reviewController to make some nested routes.

//**WE will now import reviewRoutes to use reviewRouter inside tourRoueter */
const reviewRouter = require('./../routes/reviewRoutes');
// const fs = require('fs');
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) //--> we need to change the directory now becuse we moved our code to a different folder, so we use /../ to move one folder up
// ); //--> putting this in other file called tourController.js

const router = express.Router(); //-->router is a middelware, router name is convention so we will use that
//Putting all the tourController in other file called tourController.js
// const router = express.Router(); //-->router is a middelware, router name is convention so we will use that
// const getAllTours = (req, res) => {
//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     results: tours.length,
//     data: {
//       tours: tours,
//     },
//   });
// };

// const getTour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);

//   tours.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours-simple.json`,
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         //--> 201 means created
//         status: 'success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };

// const updateTour = (req, res) => {
//   if (req.params.id > tours.length) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated the file...>',
//     },
//   });
// };

// const deleteTour = (req, res) => {
//   if (req.params.id > tours.lenght) {
//     res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   }

//   res.status(204).json({
//     status: 'success',
//     data: null, //we don't send back any data
//   }); //204 means no content
// };

// router.param('id', (req, res, next, val) => {
//   //-->val parameter will hold the value of id
//   //--> if the route do not have any id then it will be simply ignored
//   console.log(`Tour id is ${val}`);
//   next(); //--> this next() function is very important if we not do this here then our request response cycle will not work and code will stuch at this middleware only
// });
// changing the router.param by passing the checkIn function made in tourController.js file
// router.param('id', tourController.checkIn);

//create checkBody middleware
//check if the body contains name and price property
//if not, send back 400(bad request or invalid request)
//add it to the post handler stack

//**Implementing simple nested routes */
//POST /tour/23546arevarg8/reviews  that number is the tourID
//GET /tour/23546arevarg8/reviews
//GET /tour/23546arevarg8/reviews/1554932areg85
// router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('user'), //restrict to write review only for user.
//   reveiwController.createReview
// );
//we will tell the router to use reviewRouter whenever it incounters routes like this /:tourId/reviews
router.use('/:tourId/reviews', reviewRouter); //router is a middleware thatswhy we can apply 'use'. whenever router finds this type of routes then it uses reviewRouter this is called mounting.

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours); //here we are running a middleware before actually running the getAllTours (this middleware preset some query fields to get the top 5 cheap)

router
  .route('/')
  //.get(authController.protect, tourController.getAllTours) //first authcontroller.protect middleware will run first, if user is not authenticated then there will be an error so next middleware will not run, this middleware confirms that user is logged in or not
  .get(tourController.getAllTours) //there is not much sence to protecting this api route as we want to make it publicaly usable
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour
  ); //-->this post method first will go through the middeleware and after that tourController.createTour, this is middleware are chained

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan
  ); //here in this route we have passed a param called year

//**Creating routes for geospatial queries for getting the tours within the specified distance */
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-distance?distance=223&center=-40,45&unit=mi   --> this is query way of routes
// /tours-distance/223/center/-40,45/unit/mi   --> this is parameter way of routes

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  ) //patch method just update the specified field
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'), //this middleware checks the roll of user and then accordingly grant permission take actions
    tourController.deleteTour
  ); //first middleware checks that user is logged in or not, then next middleware restrict the delete action to only admin.

module.exports = router; //--> this is how we exports when we have one thing to export
