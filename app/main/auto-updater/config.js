const config = {
  baseFeedUrl: `https://hazel-server-pxufsrwofl.now.sh`,
  getFeedUrl (version) {
    let platform = process.platform;
    if (platform.toLowerCase() === 'linux') {
      platform = 'AppImage';
    }
    return `${config.baseFeedUrl}/update/${platform}/${version}`;
  }
};

export default config;