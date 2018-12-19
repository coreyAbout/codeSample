/**
 * CompleteTest transaction
 * @param {org.psytest.ycnet.CompleteTest} completeTest
 * @transaction
 */

async function completeTestTransaction(completeTest) {

  //set up parameter
  let factory = getFactory();
  const NS = "org.psytest.ycnet";

  //create testScore asset, ID = testTaker ID + test ID
  let newTestScore = factory.newResource(NS, "TestScore", completeTest.testTaker.getIdentifier() + ">" + completeTest.test.getIdentifier());
  newTestScore.totalScore = completeTest.totalScore;
  newTestScore.subScore = completeTest.subScore;
  newTestScore.scoreAccess = completeTest.scoreAccess;
  newTestScore.scoreNote = completeTest.scoreNote;

  //new relationships to test taker and test
  newTestScore.testTaker = factory.newRelationship(NS, "TestTaker", completeTest.testTaker.getIdentifier())
  newTestScore.test = factory.newRelationship(NS, "Test", completeTest.test.getIdentifier())

  // Get the asset registry for the asset.
  const assetRegistry = await getAssetRegistry(NS + ".TestScore");
  await assetRegistry.add(newTestScore);

  // Emit an event for the modified asset.
  let event = getFactory().newEvent(NS, 'TestScoreNotification');
  event.testScore = newTestScore;
  emit(event);

}

/**
 * UpdateTestScoreAccess transaction
 * @param {org.psytest.ycnet.UpdateTestScoreAccess} updateScoreAccess
 * @transaction
 */

async function updateTestScoreAccessTransaction(updateScoreAccess) {

  //set up parameter
  const NS = "org.psytest.ycnet";

  // find out add or delete to proceed
  const method = updateScoreAccess.addDelete;

  if (method == 'add') {
    const index = updateScoreAccess.testScore.scoreAccess.indexOf(updateScoreAccess.whom);
    if (index == -1) {
      updateScoreAccess.testScore.scoreAccess.push(updateScoreAccess.whom);
    }
    else {
      console.log('ERROR! user already exists!')
    }
  }
  else if (method == 'delete') {
    const index1 = updateScoreAccess.testScore.scoreAccess.indexOf(updateScoreAccess.whom);
    if (index1 != -1) {
      updateScoreAccess.testScore.scoreAccess.splice(index1, 1);
    }
    else {
      console.log('ERROR! user to delete does not exist!')
    }
  }

  let assetRegistry = await getAssetRegistry(NS + ".TestScore");

  // emit a notification
  let updateScoreAccessNotification = getFactory().newEvent(NS, 'UpdateScoreAccessNotification');
  updateScoreAccessNotification.testScore = updateScoreAccess.testScore;
  emit(updateScoreAccessNotification);

  // persist the state of the commodity
  await assetRegistry.update(updateScoreAccess.testScore);

}


/**
 * UpdateTestAccess transaction
 * @param {org.psytest.ycnet.UpdateTestAccess} updateTestAccess
 * @transaction
 */

async function updateTestAccessTransaction(updateTestAccess) {

  //set up parameter
  const NS = "org.psytest.ycnet";

  // find out add or delete to proceed
  const method = updateTestAccess.addDelete;

  if (method == 'add') {
    const index = updateTestAccess.test.testAccess.indexOf(updateTestAccess.whom);
    if (index == -1) {
      updateTestAccess.test.testAccess.push(updateTestAccess.whom);
    }
    else {
      console.log('ERROR! user already exists!')
    }
  }
  else if (method == 'delete') {
    const index1 = updateTestAccess.test.testAccess.indexOf(updateTestAccess.whom);
    if (index1 != -1) {
      updateTestAccess.test.testAccess.splice(index1, 1);
    }
    else {
      console.log('ERROR! user to delete does not exist!')
    }
  }

  let assetRegistry = await getAssetRegistry(NS + ".Test");

  // emit a notification
  let updateTestAccessNotification = getFactory().newEvent(NS, 'UpdateTestAccessNotification');
  updateTestAccessNotification.test = updateTestAccess.test;
  emit(updateTestAccessNotification);

  // persist the state of the commodity
  await assetRegistry.update(updateTestAccess.test);

}

/**
 * Update TestAdminAccess transaction
 * @param {org.psytest.ycnet.UpdateTestAdminAccess} updateTestAdminAccess
 * @transaction
 */

async function updateTestAdminAccessTransaction(updateTestAdminAccess) {

  //set up parameter
  const NS = "org.psytest.ycnet";

  // find out add or delete to proceed.
  const method = updateTestAdminAccess.addDelete;

  if (method == 'add') {
    const index = updateTestAdminAccess.test.testAdminAccess.indexOf(updateTestAdminAccess.whom);
    if (index == -1) {
      updateTestAdminAccess.test.testAdminAccess.push(updateTestAdminAccess.whom);
    }
    else {
      console.log('ERROR! user already exists!')
    }
  }
  else if (method == 'delete') {
    const index1 = updateTestAdminAccess.test.testAdminAccess.indexOf(updateTestAdminAccess.whom);
    if (index1 != -1) {
      updateTestAdminAccess.test.testAdminAccess.splice(index1, 1);
    }
    else {
      console.log('ERROR! user to delete does not exist!')
    }
  }

  let assetRegistry = await getAssetRegistry(NS + ".Test");

  // emit a notification
  let updateTestAdminAccessNotification = getFactory().newEvent(NS, 'UpdateTestAdminAccessNotification');
  updateTestAdminAccessNotification.test = updateTestAdminAccess.test;
  emit(updateTestAdminAccessNotification);

  // persist the state of the commodity
  await assetRegistry.update(updateTestAdminAccess.test);

}


/**
 * UpdateTestNote transaction
 * @param {org.psytest.ycnet.UpdateTestNote} updateTestNote
 * @transaction
 */

async function updateTestNoteTransaction(updateTestNote) {

  //set up parameter
  const NS = "org.psytest.ycnet";

  updateTestNote.test.testNote.push(updateTestNote.newNote);

  let assetRegistry = await getAssetRegistry(NS + ".Test");

  // emit a notification
  let updateTestNoteNotification = getFactory().newEvent(NS, 'UpdateTestNoteNotification');
  updateTestNoteNotification.test = updateTestNote.test;
  emit(updateTestNoteNotification);

  // persist the state of the commodity
  await assetRegistry.update(updateTestNote.test);

}

/**
 * UpdateTestScoreNote transaction
 * @param {org.psytest.ycnet.UpdateTestScoreNote} updateScoreNote
 * @transaction
 */

async function updateTestScoreNoteTransaction(updateScoreNote) {

  //set up parameter
  const NS = "org.psytest.ycnet";

  updateScoreNote.testScore.scoreNote.push(updateScoreNote.newNote);

  let assetRegistry = await getAssetRegistry(NS + ".TestScore");

  // emit a notification
  let updateScoreNoteNotification = getFactory().newEvent(NS, 'UpdateScoreNoteNotification');
  updateScoreNoteNotification.testScore = updateScoreNote.testScore;
  emit(updateScoreNoteNotification);

  // persist the state of the commodity
  await assetRegistry.update(updateScoreNote.testScore);

}

/**
 * Change the director of a Test from one director to another
 * @param {org.psytest.ycnet.UpdateTestDirector} updateTestDirector
 * @transaction
 */
async function updateTestDirectorTransaction(updateTestDirector) {

  //set up parameter
  const NS = "org.psytest.ycnet";

  updateTestDirector.test.director = updateTestDirector.newDirector;
  let assetRegistry = await getAssetRegistry(NS + ".Test");

  // emit a notification
  let updateTestDirectorNotification = getFactory().newEvent(NS, 'UpdateTestDirectorNotification');
  updateTestDirectorNotification.test = updateTestDirector.test;
  emit(updateTestDirectorNotification);

  // persist the state of the commodity
  await assetRegistry.update(updateTestDirector.test);
}
