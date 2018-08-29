const MobileCommandList = {

  groups: {
    executeMobile: {
      displayName: 'Execute Mobile',
      commands: {
        viewportScreenshot: { automation: ['ios', 'xcui'] },
        scroll: { automation: 'xcui', args: {'direction': ['up', 'down', 'left', 'right'], 'element': 'element', 'name': 'string', 'predicateString': 'string', 'toVisible': 'boolean'} },
      }
    },
    touch: {
      displayName: 'Touch'
    },
    device: {
      startActivity: {
        automation: 'android',

      }
    }
  }
};

export default MobileCommandList;