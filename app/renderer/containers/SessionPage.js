import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SessionActions from '../actions/Session';
import { getSavedTests } from '../actions/Inspector';
import Session from '../components/Session/Session';

const InspectorActions = {getSavedTests};

function mapStateToProps (state) {
  return state.session;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators({
    ...SessionActions,
    ...InspectorActions
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Session);
