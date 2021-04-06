import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from '../util';
import * as StartServerActions from '../actions/StartServer';
import StartServer from '../components/StartServer/StartServer';

function mapStateToProps (state) {
  return state.startServer;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(StartServerActions, dispatch);
}

export default withTranslation(StartServer, connect(mapStateToProps, mapDispatchToProps));
