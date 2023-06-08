//** Creating a global method for try and catch block of code */
module.exports = fn => {
  //here fn is the function which we will pass here we can say that async function of the createTour
  return (req, res, next) => {
    //catchAsync function will return a anonymos function which will be used by the createTour route and other.
    fn(req, res, next).catch(err => next(err));
  };
};
