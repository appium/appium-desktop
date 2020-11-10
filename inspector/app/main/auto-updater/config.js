import { getAutoUpdaterFeedUrl } from '../../../../shared/util';

// TODO create new feed URL for inspector so it's not the same as server
const baseFeedUrl = `https://hazel-server-pxufsrwofl.now.sh`;

export function getFeedUrl (version) {
  return getAutoUpdaterFeedUrl(version, baseFeedUrl);
}
export default {
  baseFeedUrl,
  getFeedUrl,
};
