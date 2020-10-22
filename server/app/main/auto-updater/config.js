const baseFeedUrl = `https://hazel-server-pxufsrwofl.now.sh`;

export function getFeedUrl (version) {
  let platform = process.platform;
  if (platform.toLowerCase() === 'linux') {
    platform = 'AppImage';
  }
  return `${baseFeedUrl}/update/${platform}/${version}`;
}


export default {
  baseFeedUrl,
  getFeedUrl,
};