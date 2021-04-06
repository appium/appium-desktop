import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as ConfigActions from '../actions/Config';
import ConfigPage from '../components/Config/Config';
import { withTranslation } from '../util';

function mapStateToProps (state) {
  return state.config;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(ConfigActions, dispatch);
}

export default withTranslation(ConfigPage, connect(mapStateToProps, mapDispatchToProps));
