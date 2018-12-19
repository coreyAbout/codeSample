import { ADDTEST_MONGO_SUCCESS, ADDTEST_MONGO_FAIL, ADDTEST_MONGO_START } from "./constant.js"
import { addTestMongoDB } from '../service/service';

const addTestMongoStart = () => {
  return {
    type: ADDTEST_MONGO_START,
    payload: {
      loading: true,
      testMetaActive: false,
      testMongoId: "",
      testMongoHash: "",
    }
  };
};

const addTestMongoSuccess = (Id, hash) => {
  return {
    type: ADDTEST_MONGO_SUCCESS,
    payload: {
      loading: false,
      testMetaActive: true,
      testMongoId: Id,
      testMongoHash: hash,
    }
  };
};

const addTestMongoFail = () => {
  return {
    type: ADDTEST_MONGO_FAIL,
    payload: {
      loading: false,
      testMetaActive: false,
      testMongoId: "",
      testMongoHash: "",
    }
  };
};

const addTestMongo = (testMaterial) => {
  return dispatch => {
    dispatch(addTestMongoStart());  // to start
    return addTestMongoDB(testMaterial)
    .then((response) => {
      if (response.data.mongoId) {
        dispatch(addTestMongoSuccess(response.data.mongoId, response.data.hash));
      } else {
        dispatch(addTestMongoFail())
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  }
};

export default addTestMongo;