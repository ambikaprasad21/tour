const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator'); //this is a npm package that allows us to put some custom validators
const User = require('./userModel'); //we are using userdatabase to store user as guides
//creating schema
const tourSchema = new mongoose.Schema(
  {
    //this can also be called as describing our data
    // name: String,    //we want a name of the tour and its type is going to be string, we can even set more to the name
    name: {
      //this object here is the schema type options
      type: String,
      // required: true    //we can specify the error when we are missing this field
      required: [true, 'A tour must have a name'],
      unique: true,
      maxlength: [40, 'A tour name must have less or equal to 40 characters'], //for strings we have maxlength and minlength
      minlength: [10, 'A tour name must have greater or equal to 10 characters']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: ['easy', 'medium', 'difficult'], //enum is a validator that allows only the specified values as possible values, enum is only for string don't try it for numbers
      message: 'Difficulty is either: easy, medium, difficult' //this is error message that is going to reflect when a different value is used
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], //for numbers we have min and max
      max: [5, 'Rating must be below 5.0'],
      set: val => Math.round(val * 10) / 10 //this set is going to round the rating ex 4.6666, 46.6666, 47, 4.7. This setter function is going to run each time whenevere there is a new value for ratingsAverage
    },
    ratingQuantity: {
      type: Number,
      default: 0
    },
    // rating: Number,
    rating: {
      type: Number,
      default: 4.5
    },
    // price: Number
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) must be less than original price'
      }
    },
    summary: {
      type: String,
      trim: true, //trim only works for strings and it will remove whitespaces from beginning and from end
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String, //here a reference is stored to the image
      required: [true, 'A tour must have a image']
    },
    images: [String], //these are the rest images, these all image reference are stored as an array
    createdAt: {
      type: Date,
      default: Date.now(), //if user does not give time then the default time is used
      select: false
    },
    startDates: [Date], //user will pass the date and that date is parsed by Date by javascript
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      //GeoJSON --> mongodb uses GeoJson to get the result of geospatial data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
      // any field in startLocation is not required so we can leave the startlocation as blank
    },
    locations: [
      //this embedded document will create a document in the parent document which is tour in this case. Embedded document must be stored in arrays
      //locations atleast have two fields name
      {
        type: {
          type: String,
          defualt: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number //the day of the tour in which people will go to the tour
      }
    ],
    // guides: []  //this was used for embedding
    guides: [
      //there will be some sub document inside this array
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User' //this is how we establish reference between two different dataset in mongoose, for using the User we no need to require the User document, it will work without requiring the Users
        //basically ref creates a relation between a different model
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true } //putting this line allows us to write virtual field to our data and not put that data to database.
  }
);

//tourSchema.index({ price: 1 }); //price 1 means sort in increasing order of price. So the indexes are sorted in increasing order
//this increase the performance.
tourSchema.index({ price: 1, ratingsAverage: -1 }); //most of the query will be for low price and high ratings. so we have done price in ascending order and ratingsAverage in descending order.
tourSchema.index({ startLocation: '2dsphere' }); //here we are telling mongodb that the startLocation is a 2d sphere point

// tourSchema.path('priceDiscount').validate(function(val) {   //--> this is a different for validating the input
//   return val < this.price;
// }, 'Discount price ({VALUE}) should be below regular price');

// tourSchema.set('toObject', { virtuals: true });
// tourSchema.set('toJSON', { virtuals: true });
tourSchema.virtual('durationWeeks').get(function() {
  //this durationWeeks will not be stored in database it will come only when you load the website at first
  return this.duration / 7;
});

//virtually putting the reviews to a queryed tour by using virtual properties
//VIRTUAL POPULATE
tourSchema.virtual('reviews', {
  ref: 'Review', //referencing the Review. ref will be referencing to the Review document
  localField: '_id', //foreignField means the field in the referenced document here referenced document is Reviews and this Review document have a field called tour. tour field includes the id of the tour.
  foreignField: 'tour' //tour field contains the _id of the tour document.
});
//DOCUMENT MIDDELWARE: runs before .save() .create()
tourSchema.pre('save', function(next) {
  //slug is basically a string that we can put on the url
  // console.log(this);
  this.slug = slugify(this.name, { lower: true });
  next();
}); //here tourSchema will run first following the event 'save', here the defined function will be called before the save event

//** Creating a pre middelware that will insert the user in guides fields using the user id */ this MIDDLEWARE is responsible for EMBEDDING
// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id)); //this async function will return a promise so we stored the guidesPromises
//   this.guides = await Promise.all(guidesPromises); //overwritting the array of id's by users. We run the guidesPromises which contains the promises by Promise.all()
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// }); //post middelware has access to next() and the document

//QUERY MIDDLEWARE
// this middelware will run before any find query
// tourSchema.pre('find', function(next) {
tourSchema.pre(/^find/, function(next) {
  // /^/ doing this allows us to use all the hooks that starts with the name find like findOne okay. using this allows us to not select the tour which are secret to not show in the result
  // there this corresponds to current QUERY and not the current document
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

//**Creating a pre middleware that will populate the guide field of every tour document  */
tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -__passwordChangedAt' //this will give us the data in which we are interested
  });
  next();
});

// creating a post middleware
tourSchema.post(/^find/, function(doc, next) {
  // here document is the current document created
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

//AGGREGATION MIDDLEWARE: we want to execute this middelware beofre the execution of the aggregation

//**Commenting out this aggregation middelware becuase geoNear aggragation pipeline should be the first in aggregation pipeline */
// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); //we used pipeline because aggregate are formed by pipeline,  and to put something in beginning of array we use unshift, shift to put at the end of array
//   console.log(this); //here this corresponds to current aggregation object
//   next();
// });
//creating model from the schema
const Tour = mongoose.model('Tour', tourSchema); //its a convetion to use uppercase in model name, it takes the name of the model and the schema
//this Tour name will be used to name the database collection but there it will be plural (tours) with all small letters

module.exports = Tour;
