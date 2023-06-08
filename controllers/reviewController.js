const Review = require('./../models/reviewModel');
//const catchAsync = require('./../utils/catchAsync'); //after using the handlerFactory function we no longer need to use catchAsync
const factory = require('./handlerFactory');

// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};
//   if (req.params.tourId) filter = { tour: req.params.tourId };
//   const reviews = await Review.find(filter); //finding all the reviews
//   res.status(200).json({
//     //sending all the reviews as response
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews
//     }
//   });
// });
//**Now we can use getAll method of factory handler */
exports.getAllReviews = factory.getAll(Review);

exports.setTourUserId = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId; // difinin tour if it not present in  req body
  if (!req.body.user) req.body.user = req.user.id; //specifying the user if it is not present in the req body
  next();
};

// exports.createReview = catchAsync(async (req, res, next) => {
//   //Allow nested routes
//   //if (!req.body.tour) req.body.tour = req.params.tourId; // difinin tour if it not present in  req body
//   //if (!req.body.user) req.body.user = req.user.id; //specifying the user if it is not present in the req body
//   const newReview = await Review.create(req.body); //this will take all the data that is coming from the req.body with that data it will create a new Review

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview
//     }
//   });
// });

//**after setting the setTourUserId middleware in the reviewRoute not use createOne */
exports.createReview = factory.createOne(Review);

//**Now its time to use creatOne function of factory handler to create new review but  our createReview is not exactly similar to creatOne */
//**So we need to use a middleware */

//**using the factory function to put deleteReview controller here */
exports.deleteReview = factory.deleteOne(Review); //to use this controller we need to specify a route for this
exports.updateReview = factory.updateOne(Review);
exports.getReview = factory.getOne(Review);
