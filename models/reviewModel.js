const mongoose = require('mongoose');
const Tour = require('./tourModel'); //for persisting the calculated stats we need to require the model
//review / rating / createdAt / ref to tour / ref to user
const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      //this is the field where id of tour is stored.
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.']
    }, //each reviewModel knows to which tour it belongs to.
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  } // we want to see the virtual data that is not stored inside the database but is calculated by using the data from database.
);

//**Preventing the user to write multiple review to same tour */
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//creating a pre middleware for putting the ref material in the document
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   // creating option object for populate function
  //   path: 'tour',
  //   select: 'name'
  // }).populate({ path: 'user', select: 'name photo' }); //calling populate again to populate multiple fields
  this.populate({ path: 'user', select: 'name photo' });
  next();
});

//**Creating a static method using static object of mongoose schema */
//we created a different function by using static. static method on schema run when application starts while method on schema is used whenever it is required.
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  //Aggregation can be easily implemented if we use statics
  //this corresponds to the current model. Now we will pass number of stages to aggregate function in the form of array.
  //here $match, $group are operator of aggregation pipeline
  //aggregate is always called upon the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, //create a variable nRating that will count the number of reviews, for each tour sum is increamented by 1
        avgRating: { $avg: '$rating' } //this will give avgRating for the matched tour.
      }
    }
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      //we need to await it
      ratingQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: stats[0].avgRating
    });
  }
};

//POST middleware does not require next()
reviewSchema.post('save', function() {
  //this points to current review
  //basically we have not created Review till now and we are using it so it will not work.
  //to make it work we do this.construtor in place of review
  //Review.calcAverageRatings(this.tour);
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete

reviewSchema.pre('/^findOneAnd/', async function(next) {
  //here we are using findOneAnd middleware hook
  this.r = await this.findOne(); // r stands for review. here this keyword corresponds to the current query and we need to get the review out of it.
  console.log(this.r);
});

reviewSchema.post('/^findOneAnd/', async function() {
  // await this.findOne() does Not work here, query has already executed.
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

//Now creating a model out of that schema

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
