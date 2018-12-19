import React, { Component } from 'react';
import TakeTestButtonContainer from '../containers/takeTestButtonContainer';
import TestDetailButtonContainer from '../containers/testDetailButtonContainer';

function RoleButton (props) {
  switch (props.role) {
    case "TestTaker":
      return <TakeTestButtonContainer testChainId={props.testChainId} />
    default:
      return <TestDetailButtonContainer testChainId={props.testChainId} />
  }
}

class TestList extends Component {
  constructor(props) {
    super(props)
    this.state = { tests: [], testList: [] };
  }
  componentDidMount() {
    this.setState({ tests: this.props.tests }, () => {
      let testList = this.state.tests.map((row) => {
        return <tr key={row[0]}>
          {row.filter((cell, index)=>index!==0).map((cell, index) => <td key={index}>{cell}</td>)}
          <td>
            <RoleButton role={this.props.role} testChainId={row[0]} />
          </td>
        </tr>
      })
      this.setState({ testList: testList})
    })
  }
  render() {
    return (
      <div>
        <br />
        <h3>Available tests</h3>
        <br />
        <table className="table table-responsive">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Subsections</th>
              <th scope="col">Sub Names</th>
              <th scope="col">Description</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {this.state.testList}
          </tbody>
        </table>
        <br />
        <br />
      </div>
    );
  }
}

class AllTest extends Component {
  constructor(props) {
    super(props)
    this.state = { tests: [] };
  }
  componentDidMount() {
    this.props.onLoad();
  }
  render() {
    if (this.props.loading) {
      return <p>Loading available tests...!</p>
    }
    else if (this.props.tests.length > 0){
      return <TestList role={this.props.role} tests={this.props.tests} />
    }
    else {
      return <p>No tests are available for you at the moment.</p>
    }
  }
}

export default AllTest;
