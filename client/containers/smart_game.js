import {connect} from 'react-redux';
import Game from '../components/game';

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

let SmartGame = connect(mapStateToProps, mapDispatchToProps)(Game);

export default SmartGame;
