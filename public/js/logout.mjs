/*eslint-disable */

// import axios from 'axios';
import axios from './../../node_modules/axios/dist/axios';
export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
       url: 'http://127.0.0.1:8000/api/v1/users/logout'
      //url: `${process.env.BASE_URL}/api/v1/users/logout`
    });
    if (res.data.status === 'success') location.reload(true); //this will reload data from server and not from browser cache
  } catch (err) {
    alert('not able to logout');
  }
};

// const logoutbtn = document.querySelector('.nav__el--logout');
// if (logoutbtn) {
//   logoutbtn.addEventListener('click', logout);
// }
