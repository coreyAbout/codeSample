import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { setAuthToken } from '../service/service';

//json web token
var jwt = require('jsonwebtoken');

class Nav extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('localState');
    setAuthToken('');
    window.location.reload();
  }
  render() {
    var loginOut;
    let token = localStorage.getItem('jwtToken');
    if (token) {
      //decode token
      var decoded = jwt.decode(token);
      console.log('decoded token username', decoded.username);
      //you loged in as ... and log out button
      loginOut = <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="./profile">Hi {decoded.username} </Link>
        </li>
        <li className="nav-item">
          <Link to="./"><button className="btn btn-light" onClick={this.handleClick}>Logout</button></Link>
        </li>
      </ul>
    } else {
      //server login
      loginOut = <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link to="./login"><button className="btn btn-light">Login</button></Link>
        </li>
      </ul>
    }
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-info">
          <Link className="navbar-brand" to="./">Psychology Test Blockchain</Link>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="./home">Home <span className="sr-only">(current)</span></Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="./profile">Profile </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="./test">Test </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="./testScore">Test Score </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="./history">History</Link>
              </li>
            </ul>
            {loginOut}
          </div>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>
      </div>
    );
  }
}

export default Nav;