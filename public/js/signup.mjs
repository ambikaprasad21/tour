/*eslint-disable */
import axios from './../../node_modules/axios/dist/axios';
export const signup = async (email, name, password, confirmPassword) => {
  //exporting the login function
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:8000/api/v1/users/signup', //this is our login endpoint
      //url: `${process.env.BASE_URL}/api/v1/users/signup`,
      //now sending data along with the request in the body
      data: {
        email: email, //as our endpoint takes the email and password so here we define the email and password
        name: name,
        password: password,
        confirmPassword: confirmPassword
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
    // console.log(err.response.data.message);
    alert(err.response.data.message);
  }
};
