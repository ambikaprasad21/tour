/*eslint-disable */
//update data
import axios from './../../node_modules/axios/dist/axios';

//we will update this function to also update passwords as will
// export const updateMe = async (name, email) => {

//type is either 'password' or 'data'
export const updateMe = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? `http://127.0.0.1:3000/api/v1/users/updateMyPassword`
        : `http://127.0.0.1:3000/api/v1/users/updateMe`;
    const res = await axios({
      method: 'PATCH', //you can also wrtie the method in lowercase
      // now depending on the type string we are going to decide the url
      // url: 'http://127.0.0.1:8000/api/v1/users/updateMe',
      url: url,
      // data: {
      //   name: name,
      //   email: email
      // }
      data
    });

    if (res.data.status === 'success') {
      // console.log(user);
      alert(`${type.toUpperCase()} updated successfully`);
    }
  } catch (err) {
    console.log(err.response.data.message);
  }
};
