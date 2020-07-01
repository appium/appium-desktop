import {load} from 'cheerio';

/**
 * JS code that is executed in the webview to determine the status+address bar height
 *
 * NOTE:
 * object destructuring the arguments resulted in this error with iOS (not with Android)
 *
 * `Duplicate parameter 'e' not allowed in function with destructuring parameters.`
 *
 * That's why the object destructuring is done in the method itself
 */
export function getWebviewStatusAddressBarHeight (obj) {
  // Calculate the status + address bar height
  // Address bar height for iOS 11+ is 50, for lower it is 44,
  // but we take 50 as a default here
  // For Chrome it is 56 for Android 6 to 10
  const {platformName, statBarHeight} = obj;
  const isAndroid = platformName.toLowerCase() === 'android';
  // iOS uses CSS sizes for elements and screenshots, Android sizes times DRP
  const dpr = isAndroid ? window.devicePixelRatio : 1;
  const screenHeight = window.screen.height;
  const viewportHeight = window.innerHeight;
  // Need to determine this later for Chrome
  const osAddressBarDefaultHeight = isAndroid ? 56 : 50;
  const addressToolBarHeight = screenHeight - viewportHeight - statBarHeight;
  // When a manual scroll has been executed for iOS and Android
  // the address bar becomes smaller
  const addressBarHeight = (addressToolBarHeight >= 0) && (addressToolBarHeight - osAddressBarDefaultHeight) < 0
    ? addressToolBarHeight : osAddressBarDefaultHeight;

  return statBarHeight + (addressBarHeight * dpr);
}

/**
 * JS code that is executed in the webview to set the needed attributes on the DOM so the source can be used for the
 * native inspector window.
 *
 * NOTE:
 * object destructuring the arguments resulted in this error with iOS (not with Android)
 *
 * `Duplicate parameter 'e' not allowed in function with destructuring parameters.`
 *
 * That's why the object destructuring is done in the method itself
 */
export function setHtmlElementAttributes (obj) {
  const {platformName, webviewStatusAddressBarHeight} = obj;
  const htmlElements = document.body.getElementsByTagName('*');
  const isAndroid = platformName.toLowerCase() === 'android';
  // iOS uses CSS sizes for elements and screenshots, Android sizes times DRP
  const dpr = isAndroid ? window.devicePixelRatio : 1;

  Array.from(htmlElements).forEach((el) => {
    const rect = el.getBoundingClientRect();

    el.setAttribute('data-appium-desktop-width', Math.round(rect.width * dpr));
    el.setAttribute('data-appium-desktop-height', Math.round(rect.height * dpr));
    el.setAttribute('data-appium-desktop-x', Math.round(rect.left * dpr));
    el.setAttribute('data-appium-desktop-y', Math.round(webviewStatusAddressBarHeight + (rect.top * dpr)));
  });
}

/**
 * Parse the source if it's HTML:
 * - head and scripts need to be removed to clean the HTML tree
 * - all custom attributes need to be transformed to normal width/height/x/y
 */
export function parseSource (source) {
  if (!source.includes('<html')) {
    return source;
  }

  const $ = load(source);
  // Remove the head and the scripts
  const head = $('head');
  head.remove();
  const scripts = $('script');
  scripts.remove();

  // remove all `data-appium-desktop-` prefixes
  return $.html().replace(/data-appium-desktop-/g, '');
}
