import request from 'request-promise';
import { getFeedUrl } from './config';
import semver from 'semver';

export async function checkUpdate (currentVersion) {
  try {
    const res = await request.get(getFeedUrl(currentVersion));
    if (res && semver.lt(currentVersion, res.name)) {
      return JSON.parse(res);
    }
  } catch (ign) { }

  return false;
}