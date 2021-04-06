import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from '../util';
import * as ServerActions from '../actions/ServerMonitor';
import ServerMonitor from '../components/ServerMonitor/ServerMonitor';

function mapStateToProps (state) {
  return state.serverMonitor;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(ServerActions, dispatch);
}

export default withTranslation(ServerMonitor, connect(mapStateToProps, mapDispatchToProps));
