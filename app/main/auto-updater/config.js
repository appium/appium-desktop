const config = {
  baseFeedUrl: `https://hazel-server-cfuovrxdtd.now.sh`, // TODO: Change this to production
  getFeedUrl (version) {
    return `${config.baseFeedUrl}/update/${process.platform}/${version}`;
  }
};

export default config;