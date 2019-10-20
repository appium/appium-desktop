import request from 'request-promise';
import { getFeedUrl } from './config';
import semver from 'semver';

export async function checkUpdate (currentVersion) {
  try {
    // The response is like (macOS):
    // {  "name":"v1.15.0-1",
    //    "notes":"* Bump up Appium to v1.15.0",
    //    "pub_date":"2019-10-04T04:40:37Z",
    //    "url":"https://github.com/appium/appium-desktop/releases/download/v1.15.0-1/Appium-1.15.0-1-mac.zip"}
    const res = await request.get(getFeedUrl(currentVersion));
    if (res) {
      const j = JSON.parse(res);
      if (semver.lt(currentVersion, j.name)) {
        return j;
      }
    }
  } catch (ign) { }

  return false;
}