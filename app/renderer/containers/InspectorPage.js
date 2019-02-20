import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from '../util';
import * as InspectorActions from '../actions/Inspector';
import InspectorPage from '../components/Inspector/Inspector';

function mapStateToProps (state) {
  return state.inspector;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(InspectorActions, dispatch);
}

export default withTranslation(InspectorPage, connect(mapStateToProps, mapDispatchToProps));
