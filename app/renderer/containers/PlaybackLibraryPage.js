import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/PlaybackLibrary';
import { setSavedServerParams } from '../actions/Session';
import PlaybackLibrary from '../components/Playback/PlaybackLibrary';

function mapStateToProps (state) {
  return {
    sessionState: state.session,
    ...state.playbackLibrary
  };
}

function mapDispatchToProps (dispatch) {
  const mergedActions = {...actions, setSavedServerParams};
  return bindActionCreators(mergedActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackLibrary);
