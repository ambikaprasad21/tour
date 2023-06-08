const mongoose = require('mongoose'); //requiring mongoose to create a schema for creating and storing data to our database.
const crypto = require('crypto'); //it's a built in module so need to install anything
const validator = require('validator'); //this is a npm package for validating the fields such as email
const bcrypt = require('bcryptjs'); //taking bcryptjs npm module to encrypt the password
//create a userModel schema with five fields: name, email, photo, password, passwordConfirm.

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true, //trnasform the email to lowercase.
    validate: [validator.isEmail, 'Please enter a valid email'] //using a validator to see that it is a valid email or not
  },
  photo: {
    type: String, //path where the photo is present
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'guide', 'lead-guide'], //enum is a validator which allows only a certain number of roles to change something
    default: 'user' //default is not used with required field
  },
  password: {
    type: String,
    required: true,
    minlength: 8, //setting the password length to be greater than 8 characters
    select: false
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm password'],
    validate: {
      //putting our custom validator for validating password and confirmPassword
      //This only works on CREATE and SAVE!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Password are not same'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String, //here we are going to store this token in order to compare the token which user sends
  passwordResetExpires: Date, //this is done so that user has only limited to reset and after that time the passowrd reset expires

  //for implementing the delete user feature we are now creating active property in userSchema
  active: {
    type: Boolean,
    default: true,
    select: false
  }
});

//** NOW USING A DOCUMENT MIDDLEWARE TO ENCRYPT THE PASSWORD */
//encrypting the password entered by user, for this we will be using mongoose middelware, document middleware.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); //checking that if password is modified or not, if it is not modified then we will simply return next and use other declered middleware

  //hash the password at a cost of 12
  this.password = await bcrypt.hash(this.password, 12); //12 is the cost here it shows the CPU intensive process, hash will return a promise wo we need to await

  //delete the password confirm field
  this.confirmPassword = undefined; //we basically need confirmPassword for validation and after successful validation we don't want to store it in database, thatswhy we defined it as undefined.
  next();
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || this.isNew) return next(); //if we create a new document then we need to change the passwordChangedAt

  this.passwordChangedAt = Date.now() - 1000; //we are substracting 1000(1 sec) because out token was created early and after that we are running passwordChangedAt so it is a hack to balance the time
  next();
});

//implementing a query middleware
userSchema.pre(/^find/, function(next) {
  //this middleware will be applied to all the query that starts with find, we used the regular function to gain access of the this keyword
  //this point to the current query.
  this.find({ active: { $ne: false } }); //only document whose active is set to true
  next();
}); //the find keyword makes it a query middleware

//checking that the given password is correct or not
userSchema.methods.correctPassword = async function(
  // this function is an instance method and this will be available on all the user document
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword); //we use compare method because candidatePassword is not encrypted while userPassword is encrypted
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  //this time stamp is the time when token was issued
  if (this.passwordChangedAt) {
    //in an instance method this keyword points to the current document. if passwordChangedAt property exists then user has changed the password
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    ); //getTime is a javascript data method which return time in miliseconds, and we want it in base 10 so we passed 10 as the next parameter in parseInt.
    // console.log(changedTimeStamp, JWTTimestamp);
    return JWTTimestamp < changedTimeStamp; //100<200 true
  }

  return false; //bydefault we will return false that will mean that user has not changed password after the token was issued.
};

userSchema.methods.createPasswordResetToken = function() {
  //keep the function name descriptive so that you know what actually method does
  const resetToken = crypto.randomBytes(32).toString('hex'); //here 32 is the lenght of token and it is converted to hexadecimal string
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); //encrypting the generated resetToken
  console.log(this.passwordResetToken, resetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken; //unencrypted token will be sent to the user email and encrypted one will be stored in our database
};

const User = mongoose.model('User', userSchema); //creating model out of schema.

module.exports = User; //exporting the created model out for using.
