// const fs = require('fs');
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
//const APIfeatures = require('./../utils/apiFeatures'); //we do not need it here because after creating factoryHandler we will use it in factoryHandler file
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
//--> So now we do not have only one function to export so we will not use module.export, instead we will use exports object

//using multer to uplaod images of tours
const multerStorage = multer.memoryStorage(); //storing images to memory

//Creating multer filter
//this will check that file is image or not
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};
//Multer
//customizing the multer
// const upload = multer({ dest: 'public/img/users' }); //here we have the set the destination means whenever there is an image or document upload they are stored in this destination
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

//creatin a middleware out of that upload variable
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

//midelware that is going to process the uplaoded images
exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);

  if (!req.files.imageCover || !req.files.images) return next(); //returning next if we don't encounter the images

  // 1) Cover image

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333) //3 to 2 ratio
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);
  // req.body.imageCover = imageCoverFileName;

  // 2) images
  req.body.images = []; //initializing an empty array because in our database we have an array of images and then we will fill this array
  await Promise.all(
    //Promise.all checks that all the promise are handled and after that we are going to move to the next middleware
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;
      //image processing step
      await sharp(file.buffer)
        .resize(2000, 1333) //3 to 2 ratio
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  next();
});

//upload.single('image');  //when we have a single field then this is how we upload data
//upload.array('images', 5);  //when we have multiple fields with the same name then we use array to upload data

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) //--> we need to change the directory now becuse we moved our code to a different folder, so we use /../ to move one folder up
// );

// exports.checkIn = (req, res, next, val) => {
//   console.log(`Tour id is ${val}`);
//   if (req.params.id > tours.lenght) {
//     return res.status(404).json({ status: 'fail', message: 'Invalid ID' }); //-->here we use return if we do not use return then express will continue to run and it will go to next and then to next middleware
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price'
//     });
//   }
//   //if everything is correct then we will move to next middleware
//   next();
// };

// class APIfeatures {
//   constructor(query, queryString) {
//     //queryString contains the router string, and the query contains all the data from database.
//     this.query = query;
//     this.queryString = queryString;
//   }

// filter() {
//   const queryObj = { ...this.queryString }; // ... this is used for destructuring the query object and building a new object
//   const excludeFields = ['page', 'sort', 'fields', 'limit'];
//   //for deleting all the excludeFields we will tranvese the array
//   excludeFields.forEach(el => delete queryObj[el]); //we are using forEach becuase we don't want to save a new array
//   console.log(queryObj); //{ difficulty: 'easy', duration: { gte: '5' } } --> this is simlar to querying in mongodb shell except here $ sign is missing before operator, so we need to put that $ sign

//   //ADVANCED FILTERING

//   let queryString = JSON.stringify(queryObj); //converting object to string
//   queryString = queryString.replace(
//     /\b(gte|gt|lt|lte)\b/g,
//     match => `$${match}`
//   ); //we used g to replace all the occurence of matched operator, and \b to select only the operator name not ltinit here we also have lt but we will not take it
//   console.log(JSON.parse(queryString)); //output the javascript object converted from string

//   this.query = this.query.find(JSON.parse(queryString));
//   //let query = Tour.find(JSON.parse(queryString)); //find() method recievs a javascript object, mongoose method returns a query
//   return this; //we are returning the this so that we can chain different methods
// }

// sort() {
//   if (this.queryString.sort) {
//     let sortBy = this.queryString.sort.split(',').join(' ');
//     //query = query.sort(req.query.sort); //this is how mongoose sort the documents, to write more than one sort query then use ',' to seperate. Like this ?sort=price,ratingsAvg
//     console.log(sortBy);
//     this.query = this.query.sort(sortBy);
//   } else {
//     //if someone do not define the sort then bydefault items must be sorted as specified
//     this.query = this.query.sort('-createdAt');
//   }
//   return this;
// }

// limitFields() {
//   if (this.queryString.fields) {
//     const fields = this.queryString.fields.split(',').join(' ');
//     this.query = this.query.select(fields); //this will select the required fields from the query and make a new query which contains only the required fields
//   } else {
//     this.query = this.query.select('-__v'); //the - sign is used to not select that field
//   }
//   return this;
// }

// pagination() {
//   const page = this.queryString.page * 1 || 1;
//   const limit = this.queryString.limit * 1 || 100;
//   const skip = (page - 1) * limit;

//   this.query = this.query.skip(skip).limit(limit);

//   // if (this.queryString.page) {
//   //   const countDoc = await Tour.countDocuments();
//   //   if (skip >= countDoc) throw new Error('This page does not exist');
//   // } // this error is not required when there are no page the user can know that there exist no page
//   return this;
// }
// }

exports.aliasTopTours = (req, res, next) => {
  //presetting req.query
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

//exports.getAllTours = catchAsync(async (req, res) => {
//**NOw getting rid of try and catch block by using catchAsync */
// console.log(req.query) ;
//const tours = await Tour.find(); // find() will give all the document present in Tour collection

//Excluding some words from req.query

// const queryObj = { ...req.query }; // ... this is used for destructuring the query object and building a new object
// const excludeFields = ['page', 'sort', 'fields', 'limit'];
// //for deleting all the excludeFields we will tranvese the array
// excludeFields.forEach(el => delete queryObj[el]); //we are using forEach becuase we don't want to save a new array
// console.log(queryObj); //{ difficulty: 'easy', duration: { gte: '5' } } --> this is simlar to querying in mongodb shell except here $ sign is missing before operator, so we need to put that $ sign

// //ADVANCED FILTERING

// let queryString = JSON.stringify(queryObj); //converting object to string
// queryString = queryString.replace(
//   /\b(gte|gt|lt|lte)\b/g,
//   match => `$${match}`
// ); //we used g to replace all the occurence of matched operator, and \b to select only the operator name not ltinit here we also have lt but we will not take it
// console.log(JSON.parse(queryString)); //output the javascript object converted from string

// let query = Tour.find(JSON.parse(queryString)); //find() method recievs a javascript object, mongoose method returns a query

// const tours = await Tour.find()
//   .where('duration')
//   .equals(5)
//   .where('difficulty')
//   .equals('easy');

// BETTER SORTING

// if (req.query.sort) {
//   let sortBy = req.query.sort.split(',').join(' ');
//   //query = query.sort(req.query.sort); //this is how mongoose sort the documents, to write more than one sort query then use ',' to seperate. Like this ?sort=price,ratingsAvg
//   console.log(sortBy);
//   query = query.sort(sortBy);
// } else {
//   //if someone do not define the sort then bydefault items must be sorted as specified
//   query = query.sort('-createdAt');
// }

// FIELD LIMITING

// if (req.query.fields) {
//   const fields = req.query.fields.split(',').join(' ');
//   query = query.select(fields); //this will select the required fields from the query and make a new query which contains only the required fields
// } else {
//   query = query.select('-__v'); //the - sign is used to not select that field
// }

// PAGINATION

// const page = req.query.page * 1 || 1;
// const limit = req.query.limit * 1 || 100;
// const skip = (page - 1) * limit;

// query = query.skip(skip).limit(limit);

// if (req.query.page) {
//   const countDoc = await Tour.countDocuments();
//   if (skip >= countDoc) throw new Error('This page does not exist');
// }

//   const features = new APIfeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .pagination(); //creating an instance of the class
//   const tours = await features.query; //we are awaiting the query, and query is getting from above

//   res.status(200).json({
//     status: 'success',
//     requestedAt: req.requestTime,
//     total: tours.length, //length is a property on tours
//     data: {
//       tours: tours
//     }
//   });
//   // } catch (err) {
//   //   res.status(404).json({
//   //     status: 'fail',
//   //     message: err
//   //   });
// });
//**Now we will be using getAll function of factoryHandler to get all tours */
exports.getAllTours = factory.getAll(Tour);

// exports.getTour = catchAsync(async (req, res, next) => {
//   // const id = req.params.id * 1;
//   //   if (id > tours.length) {
//   //     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   //   }
//   // const tour = tours.find((el) => el.id === id);
//   // res.status(200).json({
//   //   status: 'success',
//   //   data: {
//   //     tour: tour,
//   //   },
//   // });

//   //const tour = await Tour.findById(req.params.id); //id is part of req
//   const tour = await Tour.findById(req.params.id)
//     .populate({
//       path: 'guides',
//       select: '-__v -__passwordChangedAt' //this will give us the data in which we are interested
//     })
//     .populate({
//       path: 'reviews'
//     }); //here we are populating the tour document especially the guide field with the ref id's
//   //creating an error message
//   if (!tour) {
//     //if tour is null then we will enter in this if block.
//     return next(new AppError('No tour found with that ID', 404)); //if there is no tour with that id then we will jump straight to the next AppError
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour
//     }
//   });
// try {
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: tour
//     }
//   });
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: err
//   });
// }
// });
//**Now using the getOne function of factory to getTour */
exports.getTour = factory.getOne(Tour, { path: 'reviews' });

//** Creating a global method for try and catch block of code */
// const catchAsync = fn => {
//   //here fn is the function which we will pass here we can say that async function of the createTour
//   return (req, res, next) => {
//     //catchAsync function will return a anonymos function which will be used by the createTour route and other.
//     fn(req, res, next).catch(err => next(err));
//   };
// }; //** Now after making this function we put this function in a different file in utility folder. Now in order to use this function we will import it */

exports.createTour = catchAsync(async (req, res, next) => {
  // const newId = tours[tours.length - 1].id + 1;
  // const newTour = Object.assign({ id: newId }, req.body);
  // tours.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       //--> 201 means created
  //       status: 'success',
  //       data: {
  //         tours: newTour,
  //       },
  //     });
  //   }
  // );

  const newTour = await Tour.create(req.body); //create method is going to return a promise
  //when I created this newTour then I got an error to remove that error we put engine in package.json
  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour
    }
  });
  // try {
  //   res.status(201).json({
  //     status: 'success',
  //     data: {
  //       tours: newTour
  //     }
  //   });
  // } catch (err) {
  //   res.status(400).jsong({
  //     status: 'fail',
  //     message: err
  //   });
  // }  //** WE no longer need this this try and catch block since we are using our catchAsync function that will handle the error. */
});
//**We can use creatOne function of factory handler which will create new tour */

// exports.updateTour = async (req, res) => {
//   //   if (req.params.id > tours.length) {
//   //     return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   //   }
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       //to store the returned value of this query we need to await
//       new: true,
//       runValidators: true // due to runValidators set to true, any changes made are validated again and if it is set to false then validation will not happen again when any new update is made
//     });
//     res.status(200).json({
//       status: 'success',
//       data: {
//         // tour: tour //when property name is same as variable name we can specify only variable name to set the data
//         tour
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };
//**Now we can use updateOne function of factory controller */
exports.updateTour = factory.updateOne(Tour);

// exports.deleteTour = async (req, res) => {
//   //   if (req.params.id > tours.lenght) {
//   //     res.status(404).json({ status: 'fail', message: 'Invalid ID' });
//   //   }
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({
//       status: 'success',
//       message: 'Tour deleted...'
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };
//**Now we can use handlerFactory function to actually delete tour */
exports.deleteTour = factory.deleteOne(Tour); //here we call the deleteOne from factory with Tour as model

//Creating a handler function that is going to calculate the statistics of the data, using AGGREGATION PIPELINE
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      //aggregat method uses a lot of stages, and each stage act as apipeline means first stage comes first and then all the remaining stages
      // all the stages are objects and they all together are represented using arrays
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          // _id: null,
          //_id: '$ratingsAverage',
          // _id: '$difficulty',

          //$$ROOT represents the complete document that is processed currently in the pipeline
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 }, // it goes in every tour and our sum will be increase by one for every new tour
          numRatings: { $sum: '$ratingQuantity' },
          avgRating: { $avg: '$ratingsAverage' }, // here in front of operators we have used variable names of exactly that are in our database
          avgPrice: { $avg: '$price' }, //this will give calculate the average value by using the price from all tours
          minPrice: { $min: '$price' }, //this will give the minimum price out of all tours
          maxPrice: { $max: '$price' } //this will give the maximum price out of all tours
        }
      }, // from above pipeline we have got whole new document and now we can call sort over that or any other query which we want
      {
        $sort: { avgPrice: 1 } // this will sort the documents in ascending order, -1 for descending
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; //multiplying by 1 to conrting it to integer from string
    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates' //unwind stage is used to destructure the array documents
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numOfTourStarts: { $sum: 1 },
          tours: { $push: '$name' } //to create an array of all the tours name we have used push
        }
      },
      {
        $addFields: { month: '$_id' } // addfields will add a field to our document
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: {
          numOfTourStarts: 1
        }
      }
      // {
      //   $limit: 6 //this will limit the number of result to 6
      // }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(400).jsong({
      status: 'fail',
      message: err
    });
  }
};

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params; //destructuring the distance center unit from request parameter

  const [lat, lng] = latlng.split(','); //destructuring the lat and lng from latlng. Split function will return an array

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provie latitude and longitude in the format lat, lng',
        400
      )
    );
  }
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; //in geospatial data we pass radius in terms of radians so to convert the distance in radians we need to divide the distance by earth radius
  //we will find the tour within a sphere of center as lat, lng and raduis will be distance
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  }); //we will pass filter object inside the filter method that will act as a query for finding the tour that is closed to the given distance
  console.log(distance, lat, lng, unit);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  //we are going to aggregation pipeline so we need to mark the function as async
  const { latlng, unit } = req.params; //destructuring the distance center unit from request parameter

  const [lat, lng] = latlng.split(','); //destructuring the lat and lng from latlng. Split function will return an array

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provie latitude and longitude in the format lat, lng',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1] //multiplied by 1 convert them into numbers
        },
        distanceField: 'distance'
      }
    }
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  });
});
