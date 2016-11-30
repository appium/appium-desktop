import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as InspectorActions from '../actions/Inspector';
import InspectorPage from '../components/Inspector';

function mapStateToProps (state) {
  return state.session;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(InspectorActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(InspectorPage);