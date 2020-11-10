import { getAutoUpdaterFeedUrl } from '../../../../shared/util';

const baseFeedUrl = `https://hazel-server-pxufsrwofl.now.sh`;

export function getFeedUrl (version) {
  return getAutoUpdaterFeedUrl(version, baseFeedUrl);
}


export default {
  baseFeedUrl,
  getFeedUrl,
};
