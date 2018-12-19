import { connect } from "react-redux";
import AddTest from "../components/addTest.js";
import addTestMongo from "../actions/addTestMongo.js";

const mapStateToProps = state => {
    return {
      loading: state.newTestMongoData.loading,
      testMetaActive: state.newTestMongoData.testMetaActive,
    };
  };

const mapDispatchToProps = dispatch => {
  return {
    onClick: (testMaterial) => {
      dispatch(addTestMongo(testMaterial));
    }
  };
};

const AddTestContainer = connect(mapStateToProps, mapDispatchToProps)(
    AddTest
);

export default AddTestContainer;