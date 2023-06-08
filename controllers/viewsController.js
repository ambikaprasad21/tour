const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  //steps to build the overview page
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1
  res.status(200).render('overview', {
    tours, //tours is an array because it contains multiple documents in it
    title: 'all tours'
  });
});

//whenever a function is attached to catchAsync we need to pass the next parameter
exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user' // these are the required fields that we want to populate
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404)); //this error is passed to the global error handler
  }

  // 2)Build template
  //3) Render template using data from 1)

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Create a new account'
  });
};

exports.getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account'
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log('UPDATING USER', req.body, req.user.id);
  //I am getting this updatedUser as null
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      upsert: true, //to not get Null updatedUser use upsert: true
      new: true,
      runValidators: true
      // omitUndefined: true
    }
  );
  //console.log(updatedUser);
  // //now developing the code for rendering the user account page for updated user
  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser // this peice of line sends back the updated user which then we are using in our account.pug files
  });
});
