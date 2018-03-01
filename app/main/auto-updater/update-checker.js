import request from 'request-promise';
import { version } from '../../../package.json';
import { getFeedUrl } from './config';

export async function getUpdate (currentVersion) {
  currentVersion = currentVersion || version;
  const res = await request.get(getFeedUrl(currentVersion));
  if (res) {
    return JSON.parse(res);
  } else {
    return false;
  }
}