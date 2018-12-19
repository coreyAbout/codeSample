import { connect } from "react-redux";
import Login from "../components/login.js";
import loginUser from "../actions/loginUser.js";

const mapStateToProps = state => {
    return {
      loading: state.userData.loading,
      loggedin: state.userData.loggedin
    };
  };

const mapDispatchToProps = dispatch => {
  return {
    onClick: (userData) => {
      dispatch(loginUser(userData));
    }
  };
};

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(
  Login
);

export default LoginContainer;