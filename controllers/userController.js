const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync'); //you can use catchAsync so to avoid try and catch block.
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

//creating multer Storage
//cb is callbach function

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-userid-timestamp.jpeg
//     const ext = file.mimetype.split('/')[1]; //here ext is extension of file
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

//this way image will be stored as buffer
const multerStorage = multer.memoryStorage();

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

exports.uploadUserPhoto = upload.single('photo'); //photo is the name of the field

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; //we put the filename on req.file.filename
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

//Making the filterObj method
const filterObj = (obj, ...allowedFields) => {
  //we are going to use the obj parameter and object keys
  const newObj = {};
  Object.keys(obj).forEach(el => {
    //we are going to loop in whole object and check that if allowedFields includes the key or not
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    //500 is for server error
    // 200 is for success
    status: 'success',
    data: {
      users
    }
  });
});

exports.getMe = (req, res, next) => {
  //this middleware function is implemeted so that when a getUser route is hitted then this middleware put the user id in getOne req.params.id
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);
  // 1)Create error if user post password data
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        'This route is not for password update, Please use /updateMyPassword',
        400
      )
    ); //400 code is for bad request
  }

  // 2) Filtered out unwanted fields nmaes that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email'); //name and email are the field that we want to keep and there can be more fields. We only want to keep name and email in body
  if (req.file) filteredBody.photo = req.file.filename;

  // 3)update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    //if we do not pass the required parameter then we don't want to get error from validator so for this we created filteredBody.
    new: true, // new is set to true so it basically returns the new update result and not the old
    runValidators: true //runValidators is set to true becuase we want that mongoose should run all the validators.
  });
  console.log(req.user);
  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  //for deletMe function to work user must have logged in
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    //204 for deleting
    status: 'success',
    data: null
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    //500 is for internal server error
    status: 'err',
    message: 'this route is not yet build'
  });
};

// exports.getUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build'
//   });
// };
//**Implemeting getUser by using getOne function of factory */
exports.getUser = factory.getOne(User);

// exports.updateUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build'
//   });
// };
//**Now we can use updateUser */
exports.updateUser = factory.updateOne(User); //do not update password with this

// exports.deleteUser = (req, res) => {
//   res.status(500).json({
//     //500 is for server error
//     status: 'err',
//     message: 'this route is not yet build'
//   });
// };
//**Now implementing deleteUser with factory controller function */
exports.deleteUser = factory.deleteOne(User);
