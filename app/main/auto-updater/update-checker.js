import request from 'request-promise';
import { getFeedUrl } from './config';

export async function getUpdate (currentVersion) {
  const res = await request.get(getFeedUrl(currentVersion));
  if (res) {
    return JSON.parse(res);
  } else {
    return false;
  }
}