import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../actions/PlaybackLibrary';
import PlaybackLibrary from '../components/Playback/PlaybackLibrary';

function mapStateToProps (state) {
  return state.playbackLibrary;
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlaybackLibrary);
