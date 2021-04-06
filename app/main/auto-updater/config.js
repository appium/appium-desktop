import { getAutoUpdaterFeedUrl } from '@appium/gui-libs/dist/util';

const baseFeedUrl = `https://hazel-server-pxufsrwofl.now.sh`;

export function getFeedUrl (version) {
  return getAutoUpdaterFeedUrl(version, baseFeedUrl);
}


export default {
  baseFeedUrl,
  getFeedUrl,
};
