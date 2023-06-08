class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // whenever we use extends to a different class to be part of our new class then to get the constructor of the extended class we use super, we pass the message because it is only thing that buit in error accepts
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
