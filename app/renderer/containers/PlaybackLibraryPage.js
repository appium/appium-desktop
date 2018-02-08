import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/PlaybackLibrary';
import { setSavedServerParams, switchTabs } from '../actions/Session';
import PlaybackLibrary from '../components/Playback/PlaybackLibrary';

const sessionActions = {setSavedServerParams, switchTabs};

function mapStateToProps (state) {
  return {
    sessionState: state.session,
    ...state.playbackLibrary
  };
}

function mapDispatchToProps (dispatch) {
  const mergedActions = {...actions, ...sessionActions};
  return bindActionCreators(mergedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackLibrary);
