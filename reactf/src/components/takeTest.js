import React, { Component } from 'react';
import * as Survey from 'survey-react';
import { getTestMaterialMongo, addTestRawResultMongo } from '../service/service';

Survey.Survey.cssType = "bootstrap";

class TakeTest extends Component {
  constructor(props) {
    super(props);
    this.state = { surveyJSON: {} }
    this.sendDataToServer = this.sendDataToServer.bind(this)
  }
  componentDidMount() {
    let testContent = {};
    console.log('take test', this.props.testChainId);
    getTestMaterialMongo(this.props.testChainId)
      .then(function (response) {
        console.log("data", response.data);
        testContent = response.data.testContent;
      })
      .then(() => {
        this.setState({ surveyJSON: testContent }, () => console.log("surveyJSON", this.state.surveyJSON));
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  sendDataToServer(survey) {
    const testRawResult = {
      testTakerId: this.props.username,
      testId: this.props.testChainId,
      testRawResult: survey.data
    }
    addTestRawResultMongo(testRawResult)
      .then(function (response) {
        console.log("mongodb id:", response.data.mongoId);
        console.log("hash:", response.data.hash);
      })
      .catch(function (error) {
        console.log(error);
      });
    var resultAsString = JSON.stringify(survey.data);
    alert(resultAsString);
  }
  render() {
    return (
      <div className="App container text-left">
        <Survey.Survey json={this.state.surveyJSON} onComplete={this.sendDataToServer} />
      </div>
    );
  }
}

export default TakeTest;