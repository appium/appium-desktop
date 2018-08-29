import _ from 'lodash';

const MobileCommandList = {

  groups: {
    executeMobile: {
      displayName: 'Execute Mobile',
      commands: {
        executeMobile: {
          skipUi: true,
          java: (methodName, jsonSerializableArgs) => {
            /*let methodArgs;
            let def = MobileCommandList.executeMobile[methodName];
            if (typeof jsonObj === 'object') {
              let pairs = [];
              let defPairs = _.toPairs(def);
              let argIndex = 0;
              for (let [key, value] of _.toPairs(jsonSerializableArgs)) {
                //pairs.push([`"${key}", "",`]);
              }
              methodArgs = `ImmutableMap.of(
                ${_.toPairs(jsonSerializableArgs).m}
              )`;
            } else if (_.isString(jsonSerializableArgs)) {
              methodArgs = `"${jsonSerializableArgs}"`;
            } else {
              methodArgs = jsonSerializableArgs;
            }

            return `driver.executeScript("mobile: ${methodName}"), ${methodArgs}`;*/
          },
        },
        viewportScreenshot: { automation: ['ios', 'xcui'] },
        swipe: { automation: 'xcui', args: {'direction': 'string', 'element': 'element', 'name': 'string', 'predicateString': 'string', 'toVisible': 'boolean'} },
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