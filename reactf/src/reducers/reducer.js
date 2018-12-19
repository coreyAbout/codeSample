import { combineReducers } from "redux";
import userData from "./userData.js";
import profileData from "./profileData.js";
import newTestMongoData from "./newTestMongoData.js";
import newTestBlockchainData from "./newTestBlockchainData.js";
import allTestData from "./allTestData.js";
import allRawResultData from "./allRawResultData.js";
import passTestChainIdData from "./passTestChainIdData.js";
import passRawResultMongoIdData from "./passRawResultMongoIdData.js";
import passScoreIdData from "./passScoreIdData.js";
import allScoreData from "./allScoreData.js";


const reducer = combineReducers({
  userData,
  profileData,
  newTestMongoData,
  newTestBlockchainData,
  allTestData,
  allRawResultData,
  passTestChainIdData,
  passRawResultMongoIdData,
  passScoreIdData,
  allScoreData
});

export default reducer;