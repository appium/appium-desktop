import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as StartServerActions from '../actions/start-server';
import StartServer from '../components/StartServer';

function mapStateToProps (state) {
  return state.startServer;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(StartServerActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StartServer);
