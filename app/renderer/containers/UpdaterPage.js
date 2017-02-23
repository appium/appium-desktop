import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as UpdaterActions from '../actions/Updater';
import Updater from '../components/Updater';

function mapStateToProps (state) {
  return state.startServer;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(UpdaterActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Updater);