import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/Config';
import ConfigPage from '../components/Config/Config';

function mapStateToProps (state) {
  return state.config;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(ConfigActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigPage);
