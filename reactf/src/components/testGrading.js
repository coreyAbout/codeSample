import React, { Component } from 'react';
import * as Survey from 'survey-react';
import { getRawResultsToBeGradedMongo, updateRawResultsGradingMongo, getTestMaterialMongo, completeTest } from '../service/service';

Survey.Survey.cssType = "bootstrap";

class TestGrading extends Component {
  constructor(props) {
    super(props);
    this.state = { surveyJSON: {}, testData: {}, testId: '', testTakerId: '', active: 0, show: 'btn btn-primary container' }
    this.handleChange = this.handleChange.bind(this);
    this.sendDataToServer = this.sendDataToServer.bind(this);
    this.showMeta = this.showMeta.bind(this);
  }
  componentDidMount() {
    let testId = '';
    let testTakerId = '';
    let testContent = {};
    let testData = {};
    getRawResultsToBeGradedMongo(this.props.rawResultMongoId)
      .then(function (response) {
        console.log("data", response.data);
        testTakerId = response.data.testTakerId
        testId = response.data.testId;
        testData = response.data.testRawResult;
      })
      .then(() => {
        getTestMaterialMongo(testId)
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
        this.setState({ testData: testData, testId: testId, testTakerId: testTakerId }, () => console.log("testData", this.state.testData));
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value })
  }
  showMeta() {
    this.setState({ active: 1, show: "invisible" }, () => { console.log("active: ", this.state.active) })
  }
  sendDataToServer() {
    console.log("can get the props:", this.props.testResultId)
    var testResultId = this.props.testResultId;
    let subScore = [];
    for (let j = 0; j < this.state.subNo; j++) {
      let name = "subN" + j.toString();
      let score = "subS" + j.toString();
      subScore[j] = [this.state[name], this.state[score]];
    }
    const testChainResult = {
      testTakerId: this.state.testTakerId,
      testId: this.state.testId,
      totalScore: this.state.totalScore,
      subScore: subScore,
      scoreAccess: [],
      scoreNote: this.state.scoreNote
    }
    console.log("testChainResult", testChainResult);

    //post data to blockchain
    completeTest(testChainResult)
      .then(function (response) {
        console.log("addCompleteTest:", response.data);
        if (response.data) {
          alert(response.data);
        } else {
          alert("Error occurred!!!");
        }
        //update testResult graded status to yes in mongodb
        updateRawResultsGradingMongo(testResultId)
          .then(function (response) {
            console.log("updated to yes", response.data);
          })
          .catch(function (error) {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  render() {
    let scoreMeta;
    if (this.state.active) {
      scoreMeta = <div>
        <br />
        <h5> Test Taker: {this.state.testTakerId}</h5>
        <h5> Test ID: {this.state.testId}</h5>
        <br />
        <input className="form-control" id="scoreNote" placeholder="Score Note" onChange={this.handleChange} />
        <br />
        <button className="btn btn-primary container" onClick={this.sendDataToServer}> Save score on blockchain!</button>
      </div>
    } else {
      scoreMeta = <br />;
    }
    let subScore = [];
    let subN = '';
    let subS = '';
    for (let i = 0; i < this.state.subNo; i++) {
      subN = "subN" + i.toString();
      subS = "subS" + i.toString();
      subScore.push(
        <div key={i} className="input-group">
          <input type="text" className="form-control" id={subN} placeholder="Subsection Name" onChange={this.handleChange} />
          <input type="text" className="form-control" id={subS} placeholder="Subsection Score" onChange={this.handleChange} />
          <br />
        </div>
      )
    }
    return (
      <div className="App container text-left">
        <div className="form-group">
          <br />
          <input className="form-control" id="totalScore" placeholder="Total Score" onChange={this.handleChange} />
          <br />
          <input className="float-left" id="subNo" placeholder="subseciton number" onChange={this.handleChange} />
          {subScore}
          <br />
        </div>
        <button className={this.state.show} onClick={this.showMeta}>Save Score >> Proceed </button>
        {scoreMeta}
        <Survey.Survey json={this.state.surveyJSON} data={this.state.testData} mode="display" />
      </div>
    );
  }
}

export default TestGrading;