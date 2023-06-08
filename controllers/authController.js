const crypto = require('crypto');
const { promisify } = require('util'); //this is for required to make promises

const jwt = require('jsonwebtoken');
const User = require('./../models/userModel'); //requiring the userModel created inside the Model folder
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');

//** CREATING a function to generate the token for the given id */
const signToken = id => {
  //this is a signToken function and it is returning the new created token, for the passed id
  //** here we have used the sign function of jwt */
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN //expiresIn is an option to jwt sign function
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    //first parameter is name of the cookie and second is the value of cookie,  and third is the options to cookie
    expires: new Date(
      Date.now() + 24 * 60 * 60 * 1000 // ** It is giving error if we use process.env.JWT_COOKIE_EXPIRES_IN*/
    ),
    //secure: true, //by setting this option we are saying that send cookie only when using encrypted protocol(https). We want to use secure option only in production.
    httpOnly: true //cookie cannot be modified by the browser anyway, in order to prevent cross site scripting
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions); //setting the cookie

  //when a new user sign up then its password is also shows and we want that it must not show
  user.password = undefined; //setting the password to undefined
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user
    }
  });
};
exports.signup = catchAsync(async (req, res, next) => {
  //making a async signup function
  //const newUser = await User.create(req.body); //here by putting all the req.body to databse is a security flaw here someone can define roll as admin, so we need to select only the required fields from the body and not the whole body at once
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    role: req.body.role //this role thing created a lot problem to me at first it was not taken from the body now I have taken it outside from the body so we can set the role
  });
  //   const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //     expiresIn: process.env.JWT_EXPIRES_IN
  //   }); // {id: newUser._id} --> this is called payload and process.env.JWT_SECRET --> this is called secret, it is a string which is defined in config.env file, expiresIn is an option to jwt sign.

  // const token = signToken(newUser._id);
  //   res.status(201).json({
  //     status: 'success',
  //     token,
  //     data: {
  //       user: newUser
  //     }
  //   });
  createSendToken(newUser, 201, res);
});

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body; //since in body there is field name email wo we destructed it

    //** */ 1) check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400)); //400 is for bad request, for producing error we used our AppError class. We use return to directly get out of the login function when this condition matches
    }
    //** */ 2) check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password'); //in findOne method we pass email because field is called email and variable is also called email so ES6 allows us to write email only, here we see how we can select the fields that are hidden in model, we are explicitly selecting the password
    // here user is a document so we can call the correctPassword method defined in userModel, correctPassword method is an instance so it is available in all the user documents
    //const correct =await user.correctPassword(password, user.password); //password is got from the input, and user.password. here correct can be true or false

    if (!user || !(await user.correctPassword(password, user.password))) {
      //here after or we have all the correct thing here itself because if user dosen't exist then user.passowrd will be not defined.
      return next(new AppError('Incorrect email or password', 401)); //401 is for unaothorised
    }
    // console.log(user);

    // //** */ 3) if everything ok, send token to client
    // const token = signToken(user._id);
    // // createSendToken(user, 201, res);

    // res.status(200).json({
    //   status: 'success',
    //   token
    // });
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

//**Implementing logout functionality */
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

//** Creating a middleware that will protect the tourRoutes if user try to access the tours then this middleware first checks user is currently logged in or not. */
exports.protect = catchAsync(async (req, res, next) => {
  //** 1)Getting token and check if it's there */
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; //the authorization value contains two words one is bearer and the other is token seperated by space
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log(token);

  if (!token) {
    return next(
      //if we do not the token with request it means we are not logged In.
      new AppError('You are not logged in! Please log in to get access.', 401) // if we do not have a token then we cannot get access to the protected routes
    );
  }
  //** 2)Verification token */
  //here we have used the verify function of jwt package. Verify is an asynchronous function.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); //we are useing the jwt verify with the token and the secret. jwt.verify will return a function. decoded varaible will contain the payload
  //here in jwt verify function knows the payload from the token and to know the secret key we pass it. by getting payload and secret key it genrates a test signature
  console.log(decoded); //decoded result will contain the payload

  //** 3) Check if user still exists */
  //handling the case when user is modified(password) after getting the token.
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.')
    );
  }
  //** 4) Check if user changed password after the token was issued */
  //now calling the changePasswordAfter on currentUser document
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    //iat : means issued at. This is time for JWTTimestamp.
    return next(
      new AppError(
        'User recently changed the password! please login again.',
        401
      )
    );
  }

  req.user = currentUser; //putting all the data to the req.user. Storing the user is very important as we will use role of the user through the next middleware
  res.locals.user = currentUser; //we are putting this locals.user becasue in viewroutes I have removed the isLoggedIn controller from use to all routes so I need to explictly tell the protect controller to set locals
  next(); //if everything goes right then this next will be executed and we are given access to the protected route.
});

//**Creating a middleware that detect that user is logged in or not */
//only for render page, no errors!
exports.isLoggedIn = async (req, res, next) => {
  //** 1)Getting token and check if it's there */

  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      ); //we are useing the jwt verify with the token and the secret. jwt.verify will return a function. decoded varaible will contain the payload

      //** 2) Check if user still exists */
      //handling the case when user is modified(password) after getting the token.
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }
      //** 3) Check if user changed password after the token was issued */
      //now calling the changePasswordAfter on currentUser document
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        //iat : means issued at. This is time for JWTTimestamp.
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser; //here we have putted the currentuser in res.locale which then can be accessed in pug template
      return next(); //we need to return next() becuase if we enter in this if block and it sees only next() then outside this if block it also sees next(), so we are running two times next() which is not good
    } catch (err) {
      return next(); //if everything goes right then this next will be executed and we are given access to the protected route.
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  //here we need to pass the parameters to this middleware function
  return (req, res, next) => {
    //this is the middleware function itself, this function will get access to the roles because there is a closure
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      //we get the role from the middleware(protect) that have executed before this middleware
      //includes is a nice javascript array function. In the protect middleware we have stored the user in req.user, so now we can get the role from there
      return next(
        new AppError('You do not have permission to perform this action', 403)
      ); //403 means forbidden.
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2)  generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); //validateBeforeSave is set to false so all the validator will be set to off.

  // 3) send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? submit a PATCH request with your new password and passwordConfirm to:${resetURL}.\nIf you didn't forgot your password, please ignore this email!`;

  //sendEmail is an async function therefore we need to await it

  try {
    await sendEmail({
      email: user.email,
      subject: 'your password reset token valid for 10 min',
      message: message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined; //this only modifies the data and do not save it
    await user.save({ validateBeforeSave: false }); //so we need to do this to explicitly save the data

    return next(
      new AppError('THere was an error sending the email try again', 500)
    );
  }
});

exports.resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  }); //if token has expired then user will be send back

  // 2)if token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password; //we will set the new password that is passed to the body.
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined; //after changing the password we actually set the passwordResetToken to undefined. We have done so that password functionality is possible for One time.
  user.passwordResetExpires = undefined; //same here we set it to undefined
  await user.save(); //after doing all the required changes we actually await and save the user to database
  //we used save method becuase we want to run all the validator before saving the user credential to database.

  // 3) update changedPasswordAt property for the user

  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
};

//Creating middleware for updating the password when user is logged in.
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1)Get user from collection

  // const user = await User.findById({ email: req.body.email }); //we are going to select the user that are already logged in
  const user = await User.findById(req.user.id).select('+password'); //here we need to select the password explicitly becuase we have made the password field protected in userSchema

  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401)); //401 code for unothorised
  }

  // 3) if so update the password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save(); //we need to save the user so that all the validator in schema runs and we can get the error if there are.
  //User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: 'success',
  //   token
  // });
});
