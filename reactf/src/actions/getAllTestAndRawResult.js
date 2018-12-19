import { ALL_TEST_SUCCESS, ALL_TEST_FAIL, ALL_TEST_START } from "./constant.js"
import { getAllTestData } from '../service/service';

import { ALL_RAW_RESULT_SUCCESS, ALL_RAW_RESULT_FAIL, ALL_RAW_RESULT_START } from "./constant.js"
import { getToBeGradedListMongo } from '../service/service';


//**********get raw results depends on get all tests

const allTestStart = () => {
  return {
    type: ALL_TEST_START,
    payload: {
      loading: true,
      tests: [],
    }
  };
};

const allTestSuccess = (tests) => {
  return {
    type: ALL_TEST_SUCCESS,
    payload: {
      loading: false,
      tests: tests,
    }
  };
};

const allTestFail = () => {
  return {
    type: ALL_TEST_FAIL,
    payload: {
      loading: true,
      tests: [],
    }
  };
};

const allRawResultStart = () => {
  return {
    type: ALL_RAW_RESULT_START,
    payload: {
      loading: true,
      rawResults: [],
    }
  };
};

const allRawResultSuccess = (rawResult) => {
  return {
    type: ALL_RAW_RESULT_SUCCESS,
    payload: {
      loading: false,
      rawResults: rawResult,
    }
  };
};

const allRawResultFail = () => {
  return {
    type: ALL_RAW_RESULT_FAIL,
    payload: {
      loading: true,
      rawResults: [],
    }
  };
};

const getAllTestAndRawResult = () => {
  return dispatch => {
    dispatch(allTestStart());  // to start
    dispatch(allRawResultStart());  // to start
    return getAllTestData()
      .then((response) => {
        if (response.data.tests) {
          const tests = response.data.tests;
          const testIds = tests.map((row)=>{ return row[0] });
          dispatch(allTestSuccess(response.data.tests)); // get data succeed
          getToBeGradedListMongo(testIds)
          .then((response) => {
            if (response.data.rawResults) {
              dispatch(allRawResultSuccess(response.data.rawResults)); // get data succeed
            } else {
              dispatch(allRawResultFail()) // get data failed
              alert('Oops! Get available test raw results from the server failed!')
            }
          })
          .catch(function (error) {
            console.log(error);
          });
        } else {
          dispatch(allTestFail()) // get data failed
          alert('Oops! Get available tests from the server failed!')
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
}

export default getAllTestAndRawResult;

