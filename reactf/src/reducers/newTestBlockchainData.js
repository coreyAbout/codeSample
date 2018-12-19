import { ADDTEST_BLOCKCHAIN_START, ADDTEST_BLOCKCHAIN_SUCCESS, ADDTEST_BLOCKCHAIN_FAIL } from "../actions/constant.js";

let initialState = {
  loading: false,
  success: false,
}

const newTestBlockchainData = (state = initialState, action) => {
  switch (action.type) {
    case ADDTEST_BLOCKCHAIN_START:
      return Object.assign({}, state, action.payload);
    case ADDTEST_BLOCKCHAIN_SUCCESS:
      return Object.assign({}, state, action.payload);  // new object
    case ADDTEST_BLOCKCHAIN_FAIL:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export default newTestBlockchainData;