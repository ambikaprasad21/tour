/*eslint-disable */

const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err => {
  //we need to actually know that which field is duplicate and this can be done by regular expressions match text between quotes : (["'])(?:(?=(\\?))\2.)*?\1
  //these are error created by mongoose so it has a property called errmsg which have the duplicate value in it
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]; //regular expression are always between forward slashes
  //console.log(value);
  const message = `Duplicate field value: ${value}, Please use another value`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = err => {
  //now to basically generate a single string out of all the error validation string we need to loop all the error object and make an array.
  const errors = Object.values(err.errors).map(val => val.message); //here errors variable is basically an array of all the errors
  const message = `Invalid input data, ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//creating a seperate function for error during development
const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    //original url is the url that do not have the host
    //we need response object in order to run this code
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  //RENDERED WEBSITE
  console.error('ERROR 🔥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message
  });
};

const sendErrorProd = (err, req, res) => {
  //operational, trusted error: send message to client
  //API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    //Programming or other unknown error: Don't leak error details
    // 1) Send error message
    console.error('ERROR 🔥', err); //When we deploy our project in heroku then we will see these these console and then we will render error page

    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
  //RENDERED WEBSITE
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  //Programming or other unknown error: Don't leak error details
  // 1) Send error message
  console.error('ERROR 🔥', err); //When we deploy our project in heroku then we will see these these console and then we will render error page

  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};
module.exports = (err, req, res, next) => {
  // console.log(err.stack);

  //this is recognised as a error middelware and is called by express when there is an error, by defining four parameters express automatically knows that it is a error handling middelware
  err.statusCode = err.statusCode || 500; // the statusCode is available in err object, 500 code is used for internal server error
  err.status = err.status || 'error'; // it will contain the status of the error

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    //here when there is an error then error log have a name of CastError so that we are using that
    let error = { ...err }; //this is not working means when we use this then we no longer have access to isOperational property of appError.
    error.message = err.message; //this is used to fix the error because the error is actually coming undefined and so need to explicitly put that message in it
    // let error;
    if (err.name === 'CastError') error = handleCastErrorDB(err); //we made a function called handleCastErrorDB here we write DB to know that it is related to database

    //Error when we have code 11000, this code is generated when we use same id for two different in mongodb
    //This 11000 error code is generated when we create another tour of same name, and infact in our schema we have setted the name as unique value
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);

    //Handling errors that are generated from validation error
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

    sendErrorProd(error, req, res);
  }
};
