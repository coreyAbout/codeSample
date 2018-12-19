const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const AdminConnection = require('composer-admin').AdminConnection;
const IdCard = require ('composer-common').IdCard;
const model = require('./model');

//name space
const NS = 'org.psytest.ycnet';

//**************************mongodb related service**************************
async function saveTestMaterial(testMaterial) {
  try {
    let testMaterialSave = new model.testMaterial();
    testMaterialSave.testContent = testMaterial.testContent;
    let saved = await testMaterialSave.save();
    return saved.id;
  } catch(error) {
    console.error(error);
  }
};

async function saveTestRawResult(testRawResult) {
  try {
    let testRawResultSave = new model.testRawResult();
    testRawResultSave.testTakerId = testRawResult.testTakerId;
    testRawResultSave.testId = testRawResult.testId;
    testRawResultSave.testRawResult = testRawResult.testRawResult;
    testRawResultSave.graded = "no";
    let saved = await testRawResultSave.save();
    return saved.id;
  } catch(error) {
    console.error(error);
  }
};

async function findGradingResult(testIds) {
  try {
    let allRawResultData = {};
    // $in means find any value in the array, second {} specifies return field
    let results = await model.testRawResult.find({testId: { $in: testIds}, graded: {$in:['no', 'in process']}}, { testTakerId: 1, testId: 1, graded: 1 });
    allRawResultData.rawResults = results
    return allRawResultData;
  } catch(error) {
    console.error(error);
  }
};


async function getRawResult(testResultId) {
  try {
    let doc = await model.testRawResult.findByIdAndUpdate(testResultId, {graded: "in process"});
    return doc;
  } catch(error) {
    console.error(error);
  }
};

async function updateRawResult(testResultId) {
  try {
    let doc = await model.testRawResult.findByIdAndUpdate(testResultId, {graded: "yes"});
    return ("The graded property of the test raw result has set to yes!");
  } catch(error) {
    console.error(error);
  }
};

async function getTestMaterial(testChainId) {
  try {
    testMaterial = await model.testMaterial.findById(testChainId);
    return testMaterial;
  } catch(error) {
    console.error(error);
  }
}

//**************************blockchain related service**************************
async function addParticipant(profileData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(NS + '.' + profileData.role);
    let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    let participant = factory.newResource(NS, profileData.role, profileData.email);
    participant.firstName = profileData.firstName;
    participant.lastName = profileData.lastName;
    participant.identifier = profileData.identifier;
    await participantRegistry.add(participant);
    
    //issue identity for the participant
    let result = await businessNetworkConnection.issueIdentity(NS+'.'+profileData.role+'#'+profileData.email, profileData.email+'@psytest-network')
    const userId = result.userID;
    const userSecret = result.userSecret;
    console.log(`userID = ${result.userID}`);
    console.log(`userSecret = ${result.userSecret}`);  
    await businessNetworkConnection.disconnect();  
    //use adminConnection to creat a IDcard, then import the Idcard
    //consider security concerns??
    let adminConnection = new AdminConnection();
    await adminConnection.connect(cardName);
    //get admin card connection profile
    adminCard = await adminConnection.exportCard(cardName);
    connectionProfile = adminCard.getConnectionProfile();
    //set meta data
    const metaData = {
      "version": 1,
      "userName": userId,
      "businessNetwork": "psytest-network",
      "enrollmentSecret": userSecret,
    }
    //create the user card and import it
    var idCard = new IdCard(metaData, connectionProfile);
    var idCardName = idCard.getUserName();
    await adminConnection.importCard(idCardName, idCard);  
    await adminConnection.disconnect();  
    return ("User created!")
  } catch(error) {
    console.error(error);
  }
}

async function getAllParticipant(role, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(NS + '.' + role);  
    //list all TestTaker participants
    let allParticipant = await participantRegistry.getAll();
    let arrayLength = allParticipant.length;
    let participantArray = [];
    for (let i = 0; i < arrayLength; i++) {
      let temArray = [];
      temArray.push(allParticipant[i].email);
      temArray.push(allParticipant[i].firstName);
      temArray.push(allParticipant[i].lastName);
      temArray.push(allParticipant[i].identifier);
      participantArray.push(temArray);
    }
    await businessNetworkConnection.disconnect();
    return participantArray;
  } catch(error) {
    console.error(error);
  }
}

//get the current participant
async function getParticipant(role, ID, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(NS + '.' + role);
    let currentParticipant = await participantRegistry.get(ID);
    const participant = {email: currentParticipant.email,
      firstName: currentParticipant.firstName,
      lastName: currentParticipant.lastName,
      identifier: currentParticipant.identifier
    };
    await businessNetworkConnection.disconnect();
    return participant;
  } catch(error) {
    console.error(error);
  }
}

//update the participant
async function updateParticipant(newProfileData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let participantRegistry = await businessNetworkConnection.getParticipantRegistry(NS + '.' + newProfileData.role);
    let newProfile = await participantRegistry.get(newProfileData.id);
    newProfile.firstName = newProfileData.firstName;
    newProfile.lastName = newProfileData.lastName;
    newProfile.identifier = newProfileData.identifier;
    await participantRegistry.update(newProfile);
    await businessNetworkConnection.disconnect();
    return ('Your information has been updated!')
  } catch(error) {
    console.error(error);
  }
}

async function addTest(testData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(NS + '.Test');
    let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    let newTest = factory.newResource(NS, "Test", testData.testId);
    newTest.testName = testData.testName;  
    //new relationships to test admin
    newTest.creator = factory.newRelationship(NS, "TestAdmin", testData.creatorId);
    newTest.director = factory.newRelationship(NS, "TestAdmin", testData.directorId);

    newTest.testAdminAccess = testData.testAdminAccess;
    newTest.subNo = testData.subNo;
    newTest.subName = testData.subName;
    newTest.description = testData.description;
    newTest.hash = testData.hash;
    newTest.testAccess = testData.testAccess;  
    let newNote = factory.newConcept(NS, 'Note');
    newNote.dateTime = new Date();
    newNote.note = testData.note;
    let temArray = [];
    temArray.push(newNote);
    newTest.testNote = temArray;  
    await assetRegistry.add(newTest);
    await businessNetworkConnection.disconnect();
    return { success: true }
  } catch(error) {
    console.error(error);
      
  }
}

async function getAllTest(cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(NS + '.Test');  
    //list all Tests
    let allAsset = await assetRegistry.getAll();
    let arrayLength = allAsset.length;
    let testArray = [];
    let allTestData = {}

    for (let i = 0; i < arrayLength; i++) {
      let temArray = [];
      temArray.push(allAsset[i].testId);
      temArray.push(allAsset[i].testName);
      temArray.push(allAsset[i].subNo);
      temArray.push(allAsset[i].subName);
      temArray.push(allAsset[i].description);
     
      testArray.push(temArray);
    }

    allTestData.tests = testArray;
    await businessNetworkConnection.disconnect();
    return(allTestData);
  } catch(error) {
    console.error(error);
      
  }
}

async function getTest(testId, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(NS + '.Test');
    let currentTest = await assetRegistry.get(testId);  
    //get testNote
    let arrayLength = currentTest.testNote.length;
    let testNoteArray = [];
    for (let i = 0; i < arrayLength; i++) {
      let temArray = [];
      temArray.push(currentTest.testNote[i].dateTime);
      temArray.push(currentTest.testNote[i].note);
      testNoteArray.push(temArray);
    }  
    const test = {testId: currentTest.testId,
      testName: currentTest.testName,
      creator: currentTest.creator.getIdentifier(),
      director: currentTest.director.getIdentifier(),
      testAdminAccess: currentTest.testAdminAccess,
      subNo: currentTest.subNo,
      subName: currentTest.subName,
      description: currentTest.description,
      hash: currentTest.hash,
      testAccess: currentTest.testAccess,
      testNote: testNoteArray,
    };
    await businessNetworkConnection.disconnect();
    return test;
  } catch(error) {
      console.error(error);
  }
}

async function getAllTestScore(cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(NS + '.TestScore');  
    //list all TestScore
    let allAsset = await assetRegistry.getAll();
    let arrayLength = allAsset.length;
    let testScoreArray = [];
    let allTestScoreData = {}
    for (let i = 0; i < arrayLength; i++) {
      let temArray = [];
      temArray.push(allAsset[i].scoreId);
      temArray.push(allAsset[i].testTaker.getIdentifier());
      temArray.push(allAsset[i].test.getIdentifier());
      temArray.push(allAsset[i].totalScore);
      testScoreArray.push(temArray);
    }
    allTestScoreData.scores = testScoreArray;

    await businessNetworkConnection.disconnect();
    return allTestScoreData;
  } catch(error) {
    console.error(error);
  }
}

async function getTestScore(testScoreId, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let assetRegistry = await businessNetworkConnection.getAssetRegistry(NS + '.TestScore');
    let currentTestScore = await assetRegistry.get(testScoreId);  
    //get subScore
    let arrayLength = currentTestScore.subScore.length;
    let subScoreArray = [];
    for (let i = 0; i < arrayLength; i++) {
      let temArray = [];
      temArray.push(currentTestScore.subScore[i].subName);
      temArray.push(currentTestScore.subScore[i].subScore);
      subScoreArray.push(temArray);
    }  
    //get testScoreNote
    let arrayLength1 = currentTestScore.scoreNote.length;
    let scoreNoteArray = [];
    for (let j = 0; j < arrayLength1; j++) {
      let temArray1 = [];
      temArray1.push(currentTestScore.scoreNote[j].dateTime);
      temArray1.push(currentTestScore.scoreNote[j].note);
      scoreNoteArray.push(temArray1);
    }  
    const testScore = {scoreId: currentTestScore.scoreId,
      testTaker: currentTestScore.testTaker.getIdentifier(),
      test: currentTestScore.test.getIdentifier(),
      totalScore: currentTestScore.totalScore,
      subScore: subScoreArray,
      scoreAccess: currentTestScore.scoreAccess,
      scoreNote: scoreNoteArray
    };
    await businessNetworkConnection.disconnect();
    return testScore;
  } catch(error) {
    console.error(error);
      
  }
}


async function addCompleteTestTransaction(completeTestData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    let newTransaction = factory.newTransaction(NS, "CompleteTest");  
    //new relationships to TestTaker, Test
    newTransaction.testTaker = factory.newRelationship(NS, "TestTaker", completeTestData.testTakerId);
    newTransaction.test = factory.newRelationship(NS, "Test", completeTestData.testId);

    newTransaction.totalScore = completeTestData.totalScore;  
    //add subScore concept
    let subScoreArray = completeTestData.subScore;
    let arrayLength = subScoreArray.length;
    let temArray = [];
    for (let i = 0; i < arrayLength; i++) {
      let subScoreObject = factory.newConcept(NS, 'SubScore');
      subScoreObject.subName = subScoreArray[i][0];
      subScoreObject.subScore = subScoreArray[i][1];
      temArray.push(subScoreObject);
    }
    newTransaction.subScore = temArray;
    newTransaction.scoreAccess = completeTestData.scoreAccess;  
    //add note concept
    let newNote = factory.newConcept(NS, 'Note');
    newNote.dateTime = new Date();
    newNote.note = completeTestData.scoreNote;
    let temArray1 = [];
    temArray1.push(newNote);
    newTransaction.scoreNote = temArray1;  
    await businessNetworkConnection.submitTransaction(newTransaction);
    await businessNetworkConnection.disconnect();
    return 'Your information has successfully added to blockchain!'
  } catch(error) {
    console.error(error);
  }
}

async function addTestAccessTransaction(testAccessData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    let newTransaction = factory.newTransaction(NS, testAccessData.type);  
    //new relationships to TestTaker, Test
    newTransaction.test = factory.newRelationship(NS, "Test", testAccessData.testId);
    newTransaction.addDelete = testAccessData.addDelete;
    newTransaction.whom = testAccessData.whom;  
    await businessNetworkConnection.submitTransaction(newTransaction);
    await businessNetworkConnection.disconnect();  
    return ("You request has been made!")
  } catch(error) {
    console.error(error);
  }
}

async function addUpdateTestDirectorTransaction(testDirectorData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    let newTransaction = factory.newTransaction(NS, 'UpdateTestDirector');  
    //new relationships to Test, TestAdmin
    newTransaction.test = factory.newRelationship(NS, "Test", testDirectorData.testId);
    newTransaction.newDirector = factory.newRelationship(NS, "TestAdmin", testDirectorData.newDirectorId);
    await businessNetworkConnection.submitTransaction(newTransaction);
    await businessNetworkConnection.disconnect();  
    return ("You request has been made!")
  } catch(error) {
    console.error(error);
  }
}

async function addTestScoreAccessTransaction(testScoreAccessData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    let newTransaction = factory.newTransaction(NS, 'UpdateTestScoreAccess');  
    //new relationships to TestTaker, Test
    newTransaction.testScore = factory.newRelationship(NS, "TestScore", testScoreAccessData.testScoreId);

    newTransaction.addDelete = testScoreAccessData.addDelete;
    newTransaction.whom = testScoreAccessData.whom;  
    await businessNetworkConnection.submitTransaction(newTransaction);
    await businessNetworkConnection.disconnect();  
    return ("You request has been made!")
  } catch(error) {
    console.error(error);
  }
}

async function addNoteTransaction(noteData, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let factory = businessNetworkConnection.getBusinessNetwork().getFactory();
    let newTransaction = factory.newTransaction(NS, noteData.type);  
    if (noteData.type == 'UpdateTestScoreNote') {
      //new relationship to Test Score
      newTransaction.testScore = factory.newRelationship(NS, "TestScore", noteData.id);
    }
    else if (noteData.type == 'UpdateTestNote') {
      // new relationship to Test
      newTransaction.test = factory.newRelationship(NS, "Test", noteData.id);
    }
    else {
      console.log('The note type is incorrect!')
    }
    let newNote = factory.newConcept(NS, 'Note');
    newNote.dateTime = new Date();
    newNote.note = noteData.note;
    newTransaction.newNote = newNote;  
    await businessNetworkConnection.submitTransaction(newTransaction);
    await businessNetworkConnection.disconnect();
    return ("You request has been made!")
  } catch(error) {
    console.error(error);
  }
}

async function getAllHistory(queryPeriod, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    const startTime = queryPeriod.startTime
    const endTime = queryPeriod.endTime
    let q1 = businessNetworkConnection.buildQuery('SELECT org.hyperledger.composer.system.HistorianRecord ' +
                                                  'WHERE (transactionTimestamp > _$startTime AND transactionTimestamp < _$endTime)');
    let historianRecords = await businessNetworkConnection.query(q1,{startTime: startTime, endTime:endTime});
    await businessNetworkConnection.disconnect();

    let hr = historianRecords;
    let allhistorianData = {};
    let totalArray = [];
    for (let i = 0; i < hr.length; i++) {
      let subArray = []
      subArray.push(hr[i].transactionId);
      let transactionType = hr[i].transactionType.split('.')
      subArray.push(transactionType[transactionType.length-1]);
      subArray.push(hr[i].transactionTimestamp);
      let participantInvoking
      if (hr[i].participantInvoking) {
        participantInvoking = hr[i].participantInvoking.$identifier
      } else {
        participantInvoking = 'none'
      }
      subArray.push(participantInvoking);
      totalArray.push(subArray);
    }
    allhistorianData.histories = totalArray;
    return allhistorianData;
  } catch(error) {
    console.error(error);
  }
}


async function getHistory(transactionId, cardName) {
  let businessNetworkConnection = new BusinessNetworkConnection();
  try {
    await businessNetworkConnection.connect(cardName);
    let history = await businessNetworkConnection.getHistorian();
    let historianRecord = await history.get(transactionId);
    await businessNetworkConnection.disconnect();
    return (historianRecord);
  } catch(error) {
    console.error(error);
  }
}

module.exports = {
  addParticipant: addParticipant,
  addTest: addTest,
  getParticipant: getParticipant,
  getAllParticipant: getAllParticipant,
  updateParticipant: updateParticipant,
  getTest: getTest,
  getAllTest: getAllTest,
  addCompleteTestTransaction: addCompleteTestTransaction,
  getAllTestScore: getAllTestScore,
  getTestScore: getTestScore,
  addTestAccessTransaction: addTestAccessTransaction,
  addTestScoreAccessTransaction: addTestScoreAccessTransaction,
  addNoteTransaction: addNoteTransaction,
  addUpdateTestDirectorTransaction: addUpdateTestDirectorTransaction,
  getAllHistory: getAllHistory,
  getHistory:getHistory,
  saveTestMaterial: saveTestMaterial,
  getTestMaterial: getTestMaterial,
  saveTestRawResult: saveTestRawResult,
  findGradingResult: findGradingResult,
  getRawResult: getRawResult,
  updateRawResult: updateRawResult
};


