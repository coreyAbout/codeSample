import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Nav from './nav';
import AllTestContainer from '../containers/allTestContainer';
import AllRawResultContainer from '../containers/allRawResultContainer';

/***********************************Test Admin***************************/
function TestAdminCreateTestButton(props) {
  return (
    <div>
      <br />
      <Link to='./addTest'>
        <button type="button" className="btn btn-primary float-left">Creat new Test</button>
      </Link>
    </div>
  )
}

class Test extends Component {
  constructor(props) {
    super(props)
    this.state = { role: this.props.role, tests: this.props.tests, testIds: []}
  }
  componentDidMount() {
    //if previous test has added, reset newTestMongoData
    if (this.props.testBlockchainSuccess && this.props.testMetaActive) {
      this.props.onLoad();
    }
  }
  render() {
    let test;
    switch (this.props.role) {
      case "TestTaker":
        test = <div>
          <AllTestContainer />
        </div>
        break;
      case "TestAdmin":
        test = <div>
          <TestAdminCreateTestButton />
          <AllTestContainer  />
          <AllRawResultContainer />
        </div>
        break;
      case "DataViewer":
        test = <div>
          <AllTestContainer />
        </div>
        break;
      case "Regulator":
        test = <div>
          <h5>Regulator does not have to see tests!</h5>
        </div>
        break;
      default:
        test = <div>
          <h5>Your role does not match any roles the system has!</h5>
        </div>
    }

    return (
      <div className="App container">
        <Nav />
        <br />
        {test}
      </div>
    );
  }
}

export default Test;
