import { PASS_RAW_RESULT_MONGO_ID } from "../actions/constant.js";

let initialState = {
    updated: 0,
    rawResultMongoId: "",
}

const passRawResultMongoIdData = (state = initialState, action) => {
  switch (action.type) {
    case PASS_RAW_RESULT_MONGO_ID:
      action.payload.updated = 1 - state.updated   //flip the updated indicator between 0 and 1
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};

export default passRawResultMongoIdData;