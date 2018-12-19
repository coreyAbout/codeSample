import { connect } from "react-redux";
import Score from "../components/score.js";
import getAllScore from "../actions/getAllScore.js";


const mapStateToProps = state => {
    return {
      role: state.userData.role,
      loading: state.allScoreData.loading,
      scores: state.allScoreData.scores,
    };
};

const mapDispatchToProps = dispatch => {
    return {
      onLoad: () => {
        dispatch(getAllScore());
      },
    };
  };
  
const ScoreContainer = connect(mapStateToProps, mapDispatchToProps)(
    Score
);

export default ScoreContainer;