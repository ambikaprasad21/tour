'use strict';
const nodemailer = require('nodemailer'); //requiring the nodemailer package
//nodemailer is a service that sends email and it is not node that directly send email

const sendEmail = async options => {
  //here our options contains the email, subject, email body and some other stuff
  //1) create a transporter
  const transporter = await nodemailer.createTransport({
    //creating a transporter
    //service: 'Gmail', //here we tell the nodemailer to use Gmail
    // host: sandbox.smtp.mailtrap.io, //here we used the mailtrap host defined in config.env file
    // port: 25,
    // auth: {
    //   user: aefc4e6ff1c735,
    //   password: c770fbf30990f0
    // }
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }

    //TO use gmail: you need to activate in gmail "less secure app" option
  });

  //2) Define the email options
  const mailOptions = {
    from: 'Ambika prasad <hello@jonas.io>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  //3) Actually send email
  await transporter.sendMail(mailOptions); //sendMail is similar to the mail() function available in php for sending emails
};

module.exports = sendEmail;
