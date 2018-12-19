import axios from 'axios';

//*********************redux state tree persist*********************
//get redux state tree from local storage
function getLocalState() {
  const localState = localStorage.getItem('localState')
  if (localState) {
    return JSON.parse(localState);
  } else {
    return undefined;
  }
}

//save redux state tree to the local storage
function saveLocalState(state) {
  localStorage.setItem('localState', JSON.stringify(state));
}

//*********************login related service*********************
function register(profileData) {
  return axios.post('/register', profileData)
}
function login(userData) {
  return axios.post('/login', userData)
}

//set jwttoken for sebsequent requests
function setAuthToken(token) {
  if(token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
  } else {
      delete axios.defaults.headers.common["Authorization"]
  }
}

//*********************mongodb related service*********************
function addTestMongoDB(testMaterial) {
  return axios.post('/testMaterial/addTest', testMaterial)
}
function addTestRawResultMongo(testRawResult) {
  return axios.post('/testMaterial/addRawResult', testRawResult)
}
function getToBeGradedListMongo(testIds) {
  let JsonTestIds = {testIds: testIds}
  return axios.post('/testToBeGraded', JsonTestIds)
}
function getRawResultsToBeGradedMongo(testResultId) {
  return axios.get('/testGrading/' + testResultId)
}
//update raw result graded status to yes
function updateRawResultsGradingMongo(testResultId) {
  return axios.get('/updateRawResult/' + testResultId)
}
function getTestMaterialMongo(testId) {
  return axios.get('/testMaterial/' + testId)
}

//*********************blockchain related service*********************
function getParticipant(role, username) {
  return axios.get('/participant/' + role + '/' + username)
}
function addTestBlockchainDB(testMeta) {
  return axios.post('/asset/addTest', testMeta)
}
function getAllTestData() {
  return axios.get('/asset/Test')
}
function getSingleTest(testId) {
  return axios.get('/asset/Test/'+testId)
}
function getAllScoreData() {
  return axios.get('/asset/Score')
}
function getSingleScore(scoreId) {
  return axios.get('/asset/Score/'+scoreId)
}
function completeTest(testChainResult) {
  return axios.post('/transaction/CompleteTest', testChainResult)
}
function addTestAccess(testAdminAccess) {
  return axios.post('/transaction/testAccess', testAdminAccess)
}
function ChangeTestDirector(testDirectorData) {
  return axios.post('/transaction/testDirector', testDirectorData)
}
function UpdateTestScoreAccess(testScoreAccess) {
  return axios.post('/transaction/testScoreAccess', testScoreAccess)
}
function addNote(testNote) {
  return axios.post('/transaction/updateNote', testNote)
}
function getAllHistory(queryPeriod) {
  return axios.post('/transaction/allHistory', queryPeriod)
}
function getHistory(transactionId) {
  return axios.get('/transaction/'+transactionId)
}

export {
  getLocalState,
  saveLocalState,
  register,
  login,
  setAuthToken,
  addTestMongoDB,
  addTestRawResultMongo,
  getToBeGradedListMongo,
  getRawResultsToBeGradedMongo,
  updateRawResultsGradingMongo,
  getTestMaterialMongo,
  getParticipant,
  addTestBlockchainDB,
  getAllTestData,
  getSingleTest,
  getAllScoreData,
  getSingleScore,
  completeTest,
  addTestAccess,
  ChangeTestDirector,
  UpdateTestScoreAccess,
  addNote,
  getAllHistory,
  getHistory
}