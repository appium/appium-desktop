const config = {
  baseFeedUrl: `https://hazel-server-pxufsrwofl.now.sh`,
  getFeedUrl (version) {
    return `${config.baseFeedUrl}/update/${process.platform}/${version}`;
  }
};

export default config;