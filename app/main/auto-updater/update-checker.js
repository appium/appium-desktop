import request from 'request-promise';
import { getFeedUrl } from './config';

export async function checkUpdate (currentVersion) {
  try {
    const res = await request.get(getFeedUrl(currentVersion));
    if (res) {
      return JSON.parse(res);
    }
  } catch (ign) { }

  return false;
}