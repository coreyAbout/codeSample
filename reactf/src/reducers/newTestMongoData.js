import { ADDTEST_MONGO_START, ADDTEST_MONGO_SUCCESS, ADDTEST_MONGO_FAIL, ADDTEST_MONGO_RESET } from "../actions/constant.js";

let initialState = {
  loading: false,
  testMetaActive: false,
  testMongoID: "",
  testMongoHash: "",
}

const newTestMongoData = (state = initialState, action) => {
  switch (action.type) {
    case ADDTEST_MONGO_START:
      return Object.assign({}, state, action.payload);
    case ADDTEST_MONGO_SUCCESS:
      return Object.assign({}, state, action.payload);  // new object
    case ADDTEST_MONGO_FAIL:
      return Object.assign({}, state, action.payload);
    case ADDTEST_MONGO_RESET:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
};

export default newTestMongoData;