/*eslint-disable */
// const camelCase = require('./../../node_modules/lodash/camelCase');

import { login } from './login.mjs';
import { signup } from './signup.mjs';
import { displayMap } from './mapbox.js';
import { logout } from './logout.mjs';
import { updateMe } from './updateSettings.mjs';

// const span = document.querySelector('span'); //this is how we can get the use data here in javascript
// console.log(span.dataset.value);

//DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutbtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

//DELAGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault(); //it prevents from loading any other page
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
  });
}

//signup
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault(); //it prevents from loading any other page
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    signup(email, name, password, confirmPassword);
  });
}

if (logoutbtn) {
  logoutbtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();

    // const email = document.getElementById('email').value;
    // const name = document.getElementById('name').value;

    //for uploading image we need to create a new form and axios will consider this form as an object
    const form = new FormData(); //this is called multipart form data

    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]); //for photo it is present in files and files is an array which contains only one photo so [0]

    // updateMe({ name, email }, 'data');
    updateMe(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('password-confirm').value;
    await updateMe({ passwordCurrent, password, confirmPassword }, 'password'); //after we have successfully changed the password we need to clear the filds

    document.querySelector('.btn--save-password').textContent = 'Save passowrd';

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
