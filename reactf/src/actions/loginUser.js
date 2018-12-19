import { LOGIN_SUCCESS, LOGIN_FAIL, LOGIN_START } from "./constant.js"
import { login, setAuthToken } from '../service/service';

const userStart = () => {
  return {
    type: LOGIN_START,
    payload: {
      loading: true,
      loggedin: false,
      username: "",
      password: "",
      role: ""
    }
  };
};

const userSuccess = (userData) => {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      loading: false,
      loggedin: true,
      username: userData.username,
      password: 'passwordHidden',
      role: userData.role
    }
  };
};

const userFail = () => {
  return {
    type: LOGIN_FAIL,
    payload: {
      loading: false,
      loggedin: false,
      username: "",
      password: "",
      role: ""
    }
  };
};

const loginUser = (userData) => {
  return dispatch => {
    dispatch(userStart());  // to start
    return login(userData)
    .then((response) => {
      let token = response.data.token;
      console.log("token received", token);
      //set up token for every subsequent API call
      setAuthToken(token);
      if (token) {
        localStorage.setItem('jwtToken', token)
        dispatch(userSuccess(userData));
      } else {
        localStorage.removeItem('jwtToken');
        dispatch(userFail()) //change login to false
        alert('Username and password do no match for the selected role!')
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
};

export default loginUser;
