const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIfeatures = require('./../utils/apiFeatures');

//Factory function is a function that returns a function for us.
//this handler function will be returning controller function thatswhy we have putted this function here.

// we will pass a model to this handler functions
exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with the ID', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'Tour deleted...'
    });
  });

exports.updateOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  });

exports.createOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: doc
      }
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    //popOptions is populate options
    //if popOptions are there then we will populate the query and await the query to get the data in doc.
    let query = Model.findById(req.params.id); //Not awaiting the query write away so that in the next step we can manipulate it
    if (popOptions) query = query.populate(popOptions);
    const doc = await query; //when the entire query is ready we then await it store the information in doc.

    // const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour: doc
      }
    });
  });

exports.getAll = Model =>
  catchAsync(async (req, res) => {
    //To allow for nested reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();
    // const doc = await features.query.explain();  //the explain method print all the back side processing that mongodb has done.
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      total: doc.length,
      data: {
        data: doc
      }
    });
  });
