export function getSelector (strategy, selector) {
  switch (strategy.toLowerCase()) {
    case 'id':
      return `#${selector}`;
    case 'class name':
      return selector;
    case 'accessibility id':
      return `~${selector}`
    case 'xpath':
      return selector;
    case '-ios uiautomation':
      return `ios=${selector}`;
    case '-ios predicate string':
      return `ios=predicate=${selector}`;
    case '-ios class chain':
      return `ios=chain=${selector}`;
    case '-android uiautomator':
      return `android=${selector}`;
    default:
      break;
  }
};