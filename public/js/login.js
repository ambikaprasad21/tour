/*eslint-disable */
//import '@babel/polyfill'; //we do not store it in a variable because we want this whole file to be included in our bundle/index.js file
import axios from 'axios/dist/axios';
export const login = async (email, password) => {
  //exporting the login function
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/login', //this is our login endpoint
      //url: `https://pratik-do9h.onrender.com/api/v1/users/login`, //in production we need to remove the localhost domain
      //now sending data along with the request in the body
      data: {
        email: email, //as our endpoint takes the email and password so here we define the email and password
        password: password
      }
    });
    //**After successful login we are going to jump to the main tour page from login page */
    if (res.data.status === 'success') {
      //we are checking that this login function actual succed or not by getting the status message that we actually setup in our api
      alert('Logged in successfully');
      window.setTimeout(() => {
        //if user data is correct then we will direct the user to overview page
        location.assign('/'); //after succefull login we will change the login page to '/' overview page after 1.5seconds
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data.message);
    // alert(err.response.data.message);
  }
};

//**Commenting it out here and adding this piece of code in index.js file becuase this file is used for creating parcel */

// const loginForm = document.querySelector('.form');
// loginForm.addEventListener('submit', e => {
//   e.preventDefault(); //it prevents from loading any other page
//   const email = document.getElementById('email').value;
//   const password = document.getElementById('password').value;
//   login(email, password);
// });
