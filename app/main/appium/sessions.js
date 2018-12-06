export default class Sessions {

  constructor () {
    this.sessionMap = new Map(); // Maps window id's to a WDIO session
  }

  /**
   * Create a new session for an inspector window and add it to the list
   * @param {string} windowId ID of the Inspector browser window that this session is for
   * @param {object} args Session creation args
   */
  addSession (windowId, args) {

  }

  /**
   * Closes a session and removes it from the session map
   * @param {string} windowId ID of the Inspector browser window that this session is for
   */
  killSession (windowId) {
    this.sessionMap.delete(windowId);
  }

}