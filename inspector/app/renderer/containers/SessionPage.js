import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from '../util';
import * as SessionActions from '../actions/Session';
import Session from '../components/Session/Session';

function mapStateToProps (state) {
  return state.session;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(SessionActions, dispatch);
}

export default withTranslation(Session, connect(mapStateToProps, mapDispatchToProps));
