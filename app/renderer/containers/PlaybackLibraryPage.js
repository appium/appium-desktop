import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/PlaybackLibrary';
import { setSavedServerParams, switchTabs, getCapsObject } from '../actions/Session';
import { getSavedTests } from '../actions/Inspector';
import PlaybackLibrary from '../components/Playback/PlaybackLibrary';

const sessionActions = {setSavedServerParams, switchTabs, getCapsObject};
const inspectorActions = {getSavedTests};

function mapStateToProps (state) {
  return {
    sessionState: state.session,
    ...state.playbackLibrary
  };
}

function mapDispatchToProps (dispatch) {
  const mergedActions = {...actions, ...sessionActions, ...inspectorActions};
  return bindActionCreators(mergedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackLibrary);
