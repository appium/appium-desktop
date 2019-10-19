import request from 'request-promise';
import { getFeedUrl } from './config';
import semver from 'semver';

export async function checkUpdate (currentVersion) {
  try {
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