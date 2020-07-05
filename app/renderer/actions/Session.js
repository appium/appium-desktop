import { ipcRenderer } from 'electron';
import settings from '../../shared/settings';
import { v4 as UUID } from 'uuid';
import url from 'url';
import { push } from 'connected-react-router';
import { notification } from 'antd';
import { debounce, toPairs, union, without, keys } from 'lodash';
import { setSessionDetails } from './Inspector';
import i18n from '../../configs/i18next.config.renderer';
import CloudProviders from '../components/Session/CloudProviders';

export const NEW_SESSION_REQUESTED = 'NEW_SESSION_REQUESTED';
export const NEW_SESSION_BEGAN = 'NEW_SESSION_BEGAN';
export const NEW_SESSION_DONE = 'NEW_SESSION_DONE';
export const CHANGE_CAPABILITY = 'CHANGE_CAPABILITY';
export const SAVE_SESSION_REQUESTED = 'SAVE_SESSION_REQUESTED';
export const SAVE_SESSION_DONE = 'SAVE_SESSION_DONE';
export const GET_SAVED_SESSIONS_REQUESTED = 'GET_SAVED_SESSIONS_REQUESTED';
export const GET_SAVED_SESSIONS_DONE = 'GET_SAVED_SESSIONS_DONE';
export const SET_CAPABILITY_PARAM = 'SET_CAPABILITY_PARAM';
export const ADD_CAPABILITY = 'ADD_CAPABILITY';
export const REMOVE_CAPABILITY = 'REMOVE_CAPABILITY';
export const SWITCHED_TABS = 'SWITCHED_TABS';
export const SET_CAPS = 'SET_CAPS';
export const SAVE_AS_MODAL_REQUESTED = 'SAVE_AS_MODAL_REQUESTED';
export const HIDE_SAVE_AS_MODAL_REQUESTED = 'HIDE_SAVE_AS_MODAL_REQUESTED';
export const SET_SAVE_AS_TEXT = 'SET_SAVE_AS_TEXT';
export const DELETE_SAVED_SESSION_REQUESTED = 'DELETE_SAVED_SESSION_REQUESTED';
export const DELETE_SAVED_SESSION_DONE = 'DELETE_SAVED_SESSION_DONE';
export const CHANGE_SERVER_TYPE = 'CHANGE_SERVER_TYPE';
export const SET_SERVER_PARAM = 'SET_SERVER_PARAM';
export const SET_SERVER = 'SET_SERVER';
export const SESSION_LOADING = 'SESSION_LOADING';
export const SESSION_LOADING_DONE = 'SESSION_LOADING_DONE';

export const SAVED_SESSIONS = 'SAVED_SESSIONS';
export const SESSION_SERVER_PARAMS = 'SESSION_SERVER_PARAMS';
export const SESSION_SERVER_TYPE = 'SESSION_SERVER_TYPE';
export const SERVER_ARGS = 'SERVER_ARGS';
export const VISIBLE_PROVIDERS = 'VISIBLE_PROVIDERS';

export const SET_ATTACH_SESS_ID = 'SET_ATTACH_SESS_ID';

export const GET_SESSIONS_REQUESTED = 'GET_SESSIONS_REQUESTED';
export const GET_SESSIONS_DONE = 'GET_SESSIONS_DONE';


export const ENABLE_DESIRED_CAPS_EDITOR = 'ENABLE_DESIRED_CAPS_EDITOR';
export const ABORT_DESIRED_CAPS_EDITOR = 'ABORT_DESIRED_CAPS_EDITOR';
export const SAVE_RAW_DESIRED_CAPS = 'SAVE_RAW_DESIRED_CAPS';
export const SET_RAW_DESIRED_CAPS = 'SET_RAW_DESIRED_CAPS';
export const SHOW_DESIRED_CAPS_JSON_ERROR = 'SHOW_DESIRED_CAPS_JSON_ERROR';

export const IS_ADDING_CLOUD_PROVIDER = 'IS_ADDING_CLOUD_PROVIDER';

export const SET_PROVIDERS = 'SET_PROVIDERS';

const serverTypes = {};
for (const key of keys(CloudProviders)) {
  serverTypes[key] = key;
}
serverTypes.local = 'local';
serverTypes.remote = 'remote';

export const ServerTypes = serverTypes;

const JSON_TYPES = ['object', 'number', 'boolean'];

export function getCapsObject (caps) {
  return Object.assign({}, ...(caps.map((cap) => {
    if (JSON_TYPES.indexOf(cap.type) !== -1) {
      try {
        let obj = JSON.parse(cap.value);
        return {[cap.name]: obj};
      } catch (ign) {}
    }
    return {[cap.name]: cap.value};
  })));
}

export function showError (e, methodName, secs = 5) {
  let errMessage;
  if (e['jsonwire-error'] && e['jsonwire-error'].status === 7) {
    errMessage = i18n.t('findElementFailure', {methodName});
  } else if (e.data) {
    try {
      e.data = JSON.parse(e.data);
    } catch (ign) {}
    if (e.data.value && e.data.value.message) {
      errMessage = e.data.value.message;
    } else {
      errMessage = e.data;
    }
  } else if (e.message) {
    errMessage = e.message;
  } else if (e.code) {
    errMessage = e.code;
  } else {
    errMessage = i18n.t('Could not start session');
  }
  if (errMessage === 'ECONNREFUSED') {
    errMessage = i18n.t('couldNotConnect');
  }

  notification.error({
    message: methodName ? i18n.t('callToMethodFailed', {methodName}) : i18n.t('Error'),
    description: errMessage,
    duration: secs
  });

}

/**
 * Change the caps object and then go back to the new session tab
 */
export function setCaps (caps, uuid) {
  return (dispatch) => {
    dispatch({type: SET_CAPS, caps, uuid});
  };
}

/**
 * Change a single desired capability
 */
export function changeCapability (key, value) {
  return (dispatch) => {
    dispatch({type: CHANGE_CAPABILITY, key, value});
  };
}

/**
 * Push a capability to the list
 */
export function addCapability () {
  return (dispatch) => {
    dispatch({type: ADD_CAPABILITY});
  };
}

/**
 * Update value of a capability parameter
 */
export function setCapabilityParam (index, name, value) {
  return (dispatch) => {
    dispatch({type: SET_CAPABILITY_PARAM, index, name, value});
  };
}

/**
 * Delete a capability from the list
 */
export function removeCapability (index) {
  return (dispatch) => {
    dispatch({type: REMOVE_CAPABILITY, index});
  };
}

/**
 * Start a new appium session with the given caps
 */
export function newSession (caps, attachSessId = null) {
  return async (dispatch, getState) => {

    dispatch({type: NEW_SESSION_REQUESTED, caps});

    let desiredCapabilities = caps ? getCapsObject(caps) : null;
    let session = getState().session;
    let host, port, username, accessKey, https, path, token;
    desiredCapabilities = includeSafariInWebviews(desiredCapabilities);
    desiredCapabilities = setChromeDriverToJsonwp(desiredCapabilities);

    switch (session.serverType) {
      case ServerTypes.local:
        host = session.server.local.hostname;
        if (host === '0.0.0.0') {
          // if we're on windows, we won't be able to connect directly to '0.0.0.0'
          // so just connect to localhost; if we're listening on all interfaces,
          // that will of course include 127.0.0.1 on all platforms
          host = 'localhost';
        }
        port = session.server.local.port;
        break;
      case ServerTypes.remote:
        host = session.server.remote.hostname || '127.0.0.1';
        port = session.server.remote.port || 4723;
        path = session.server.remote.path;
        https = session.server.remote.ssl;
        break;
      case ServerTypes.sauce:
        host = session.server.sauce.dataCenter === 'eu-central-1' ?
          'ondemand.eu-central-1.saucelabs.com' : 'ondemand.saucelabs.com';
        port = 80;
        if (session.server.sauce.useSCProxy) {
          host = session.server.sauce.scHost || 'localhost';
          port = parseInt(session.server.sauce.scPort, 10) || 4445;
        }
        username = session.server.sauce.username || process.env.SAUCE_USERNAME;
        accessKey = session.server.sauce.accessKey || process.env.SAUCE_ACCESS_KEY;
        if (!username || !accessKey) {
          notification.error({
            message: i18n.t('Error'),
            description: i18n.t('sauceCredentialsRequired'),
            duration: 4
          });
          return;
        }
        https = false;
        break;
      case ServerTypes.testobject:
        host = process.env.TESTOBJECT_HOST || `${session.server.testobject.dataCenter || 'us1'}.appium.testobject.com`;
        port = 443;
        https = true;
        if (caps) {
          desiredCapabilities.testobject_api_key = session.server.testobject.apiKey || process.env.TESTOBJECT_API_KEY;
        }
        break;
      case ServerTypes.headspin: {
        const headspinUrl = url.parse(session.server.headspin.webDriverUrl);
        host = session.server.headspin.hostname = headspinUrl.hostname;
        port = session.server.headspin.port = headspinUrl.port;
        path = session.server.headspin.path = headspinUrl.pathname;
        https = session.server.headspin.ssl = headspinUrl.protocol === 'https:';
        break;
      }
      case ServerTypes.perfecto:
        host = session.server.perfecto.hostname;
        port = session.server.perfecto.port || 80;
        token = session.server.perfecto.token || process.env.PERFECTO_TOKEN;
        path = session.server.perfecto.path = '/nexperience/perfectomobile/wd/hub';
        if (!token) {
          notification.error({
            message: i18n.t('Error'),
            description: i18n.t('Perfecto SecurityToken is required'),
            duration: 4
          });
          return;
        }
        desiredCapabilities.securityToken = token;
        https = session.server.perfecto.ssl = false;
        break;
      case ServerTypes.browserstack:
        host = process.env.BROWSERSTACK_HOST || 'hub-cloud.browserstack.com';
        port = session.server.browserstack.port = 443;
        path = session.server.browserstack.path = '/wd/hub';
        username = session.server.browserstack.username || process.env.BROWSERSTACK_USERNAME;
        desiredCapabilities['browserstack.source'] = 'appiumdesktop';
        accessKey = session.server.browserstack.accessKey || process.env.BROWSERSTACK_ACCESS_KEY;
        if (!username || !accessKey) {
          notification.error({
            message: i18n.t('Error'),
            description: i18n.t('browserstackCredentialsRequired'),
            duration: 4
          });
          return;
        }
        https = session.server.browserstack.ssl = true;
        break;
      case ServerTypes.bitbar:
        host = process.env.BITBAR_HOST || 'appium.bitbar.com';
        port = session.server.bitbar.port = 443;
        path = session.server.bitbar.path = '/wd/hub';
        accessKey = session.server.bitbar.apiKey || process.env.BITBAR_API_KEY;
        if (!accessKey) {
          notification.error({
            message: i18n.t('Error'),
            description: i18n.t('bitbarCredentialsRequired'),
            duration: 4
          });
          return;
        }
        desiredCapabilities.testdroid_source = 'appiumdesktop';
        desiredCapabilities.testdroid_apiKey = accessKey;
        https = session.server.bitbar.ssl = true;
        break;
      case ServerTypes.kobiton:
        host = process.env.KOBITON_HOST || 'api.kobiton.com';
        port = session.server.kobiton.port = 443;
        path = session.server.kobiton.path = '/wd/hub';
        username = session.server.kobiton.username || process.env.KOBITON_USERNAME;
        desiredCapabilities['kobiton.source'] = 'appiumdesktop';
        accessKey = session.server.kobiton.accessKey || process.env.KOBITON_ACCESS_KEY;
        if (!username || !accessKey) {
          notification.error({
            message: i18n.t('Error'),
            description: i18n.t('kobitonCredentialsRequired'),
            duration: 4
          });
          return;
        }
        https = session.server.kobiton.ssl = true;
        break;
      case ServerTypes.pcloudy:
        host = session.server.pcloudy.hostname;
        port = session.server.pcloudy.port = 443;
        path = session.server.pcloudy.path = '/objectspy/wd/hub';
        username = session.server.pcloudy.username || process.env.PCLOUDY_USERNAME;
        desiredCapabilities.pCloudy_Username = username;
        accessKey = session.server.pcloudy.accessKey || process.env.PCLOUDY_ACCESS_KEY;
        desiredCapabilities.pCloudy_ApiKey = accessKey;
        if (!username || !accessKey) {
          notification.error({
            message: 'Error',
            description: 'PCLOUDY username and api key are required!',
            duration: 4
          });
          return;
        }
        https = session.server.pcloudy.ssl = true;
        break;
      case ServerTypes.testingbot:
        host = session.server.testingbot.hostname = process.env.TB_HOST || 'hub.testingbot.com';
        port = session.server.testingbot.port = 443;
        username = session.server.testingbot.key || process.env.TB_KEY;
        accessKey = session.server.testingbot.secret || process.env.TB_SECRET;
        desiredCapabilities['tb.source'] = 'appiumdesktop';
        if (!username || !accessKey) {
          notification.error({
            message: 'Error',
            description: i18n.t('testingbotCredentialsRequired'),
            duration: 4
          });
          return;
        }
        https = session.server.testingbot.ssl = true;
        break;
      case ServerTypes.experitest: {
        if (!session.server.experitest.url || !session.server.experitest.accessKey) {
          notification.error({
            message: i18n.t('Error'),
            description: i18n.t('experitestAccessKeyURLRequired'),
            duration: 4
          });
          return;
        }
        desiredCapabilities['experitest:accessKey'] = session.server.experitest.accessKey;
        let experitestUrl = url.parse(session.server.experitest.url);
        host = session.server.experitest.hostname = experitestUrl.hostname;
        path = session.server.experitest.path = '/wd/hub';
        port = session.server.experitest.port = experitestUrl.port;
        https = session.server.experitest.ssl = experitestUrl.protocol === 'https:';
        break;
      }
      default:
        break;
    }

    let rejectUnauthorized = !session.server.advanced.allowUnauthorized;
    let proxy;
    if (session.server.advanced.useProxy && session.server.advanced.proxy) {
      proxy = session.server.advanced.proxy;
    }

    // Start the session
    ipcRenderer.send('appium-create-new-session', {
      desiredCapabilities,
      attachSessId,
      host,
      port,
      path,
      username,
      accessKey,
      https,
      rejectUnauthorized,
      proxy,
    });

    dispatch({type: SESSION_LOADING});

    // If it failed, show an alert saying it failed
    ipcRenderer.once('appium-new-session-failed', (evt, e) => {
      dispatch({type: SESSION_LOADING_DONE});
      removeNewSessionListeners();
      showError(e, 0);
    });

    ipcRenderer.once('appium-new-session-ready', () => {
      dispatch({type: SESSION_LOADING_DONE});
      // pass some state to the inspector that it needs to build recorder
      // code boilerplate
      setSessionDetails({
        desiredCapabilities,
        host,
        port,
        path,
        username,
        accessKey,
        https,
      })(dispatch);
      removeNewSessionListeners();
      dispatch(push('/inspector'));
    });

    // Save the current server settings
    await settings.set(SESSION_SERVER_PARAMS, session.server);
  };
}


/**
 * Saves the caps
 */
export function saveSession (caps, params) {
  return async (dispatch) => {
    let {name, uuid} = params;
    dispatch({type: SAVE_SESSION_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS);
    if (!uuid) {

      // If it's a new session, add it to the list
      uuid = UUID();
      let newSavedSession = {
        date: +(new Date()),
        name,
        uuid,
        caps,
      };
      savedSessions.push(newSavedSession);
    } else {

      // If it's an existing session, overwrite it
      for (let session of savedSessions) {
        if (session.uuid === uuid) {
          session.caps = caps;
        }
      }
    }
    await settings.set(SAVED_SESSIONS, savedSessions);
    await getSavedSessions()(dispatch);
    dispatch({type: SET_CAPS, caps, uuid});
    dispatch({type: SAVE_SESSION_DONE});
  };
}

/**
 * Get the sessions saved by the user
 */
export function getSavedSessions () {
  return async (dispatch) => {
    dispatch({type: GET_SAVED_SESSIONS_REQUESTED});
    let savedSessions = await settings.get(SAVED_SESSIONS);
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions});
  };
}

/**
 * Switch to a different tab
 */
export function switchTabs (key) {
  return (dispatch) => {
    dispatch({type: SWITCHED_TABS, key});
  };
}

/**
 * Open a 'Save As' modal
 */
export function requestSaveAsModal () {
  return (dispatch) => {
    dispatch({type: SAVE_AS_MODAL_REQUESTED});
  };
}

/**
 * Hide the 'Save As' modal
 */
export function hideSaveAsModal () {
  return (dispatch) => {
    dispatch({type: HIDE_SAVE_AS_MODAL_REQUESTED});
  };
}

/**
 * Set the text to save capabilities as
 */
export function setSaveAsText (saveAsText) {
  return (dispatch) => {
    dispatch({type: SET_SAVE_AS_TEXT, saveAsText});
  };
}

/**
 * Delete a saved session
 */
export function deleteSavedSession (uuid) {
  return async (dispatch) => {
    dispatch({type: DELETE_SAVED_SESSION_REQUESTED, uuid});
    let savedSessions = await settings.get(SAVED_SESSIONS);
    let newSessions = savedSessions.filter((session) => session.uuid !== uuid);
    await settings.set(SAVED_SESSIONS, newSessions);
    dispatch({type: DELETE_SAVED_SESSION_DONE});
    dispatch({type: GET_SAVED_SESSIONS_DONE, savedSessions: newSessions});
  };
}

/**
 * Set the session id to attach to
 */
export function setAttachSessId (attachSessId) {
  return (dispatch) => {
    dispatch({type: SET_ATTACH_SESS_ID, attachSessId});
  };
}

/**
 * Change the server type
 */
export function changeServerType (serverType) {
  return async (dispatch, getState) => {
    await settings.set(SESSION_SERVER_TYPE, serverType);
    dispatch({type: CHANGE_SERVER_TYPE, serverType});
    getRunningSessions()(dispatch, getState);
  };
}

/**
 * Set a server parameter (host, port, etc...)
 */
export function setServerParam (name, value, serverType) {
  const debounceGetRunningSessions = debounce(getRunningSessions(), 5000);
  return async (dispatch, getState) => {
    serverType = serverType || getState().session.serverType;
    await settings.set(SESSION_SERVER_TYPE, serverType);
    dispatch({type: SET_SERVER_PARAM, serverType, name, value});
    debounceGetRunningSessions(dispatch, getState);
  };
}

/**
 * Set the local server hostname and port to whatever was saved in 'actions/StartServer.js' so that it
 * defaults to what the currently running appium server is
 */
export function setLocalServerParams () {
  return async (dispatch, getState) => {
    let serverArgs = await settings.get(SERVER_ARGS);
    // Get saved server args from settings and set local server settings to it. If there are no saved args, set local
    // host and port to undefined
    if (serverArgs) {
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: serverArgs.port});
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: 'localhost'});
    } else {
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'port', value: undefined});
      dispatch({type: SET_SERVER_PARAM, serverType: ServerTypes.local, name: 'hostname', value: undefined});
      if (getState().session.serverType === 'local') {
        await changeServerType('remote')(dispatch, getState);
      }
    }
  };
}

/**
 * Set the server parameters to whatever they were last saved as.
 * Params are saved whenever there's a new session
 */
export function setSavedServerParams () {
  return async (dispatch, getState) => {
    let server = await settings.get(SESSION_SERVER_PARAMS);
    let serverType = await settings.get(SESSION_SERVER_TYPE);
    let currentProviders = getState().session.visibleProviders;

    if (server) {
      // if we have a cloud provider as a saved server, but for some reason the
      // cloud provider is no longer in the list, revert server type to remote
      if (keys(CloudProviders).includes(serverType) &&
          !currentProviders.includes(serverType)) {
        serverType = ServerTypes.remote;
      }
      dispatch({type: SET_SERVER, server, serverType});
    }
  };
}

export function getRunningSessions () {
  return (dispatch, getState) => {
    const avoidServerTypes = [
      'sauce', 'testobject'
    ];
    // Get currently running sessions for this server
    const state = getState().session;
    const {server, serverType} = state;
    const serverInfo = server[serverType];

    dispatch({type: GET_SESSIONS_REQUESTED});
    if (avoidServerTypes.includes(serverType)) {
      dispatch({type: GET_SESSIONS_DONE});
    } else {
      ipcRenderer.send('appium-client-get-sessions', {
        host: serverInfo.hostname, port: serverInfo.port, path: serverInfo.path, ssl: serverInfo.ssl
      });
      ipcRenderer.once('appium-client-get-sessions-response', (evt, e) => {
        const res = JSON.parse(e.res);
        dispatch({type: GET_SESSIONS_DONE, sessions: res.value});
        removeRunningSessionsListeners();
      });
      ipcRenderer.once('appium-client-get-sessions-fail', () => {
        dispatch({type: GET_SESSIONS_DONE});
        removeRunningSessionsListeners();
      });
    }
  };
}

export function startDesiredCapsEditor () {
  return (dispatch) => {
    dispatch({type: ENABLE_DESIRED_CAPS_EDITOR});
  };
}

export function abortDesiredCapsEditor () {
  return (dispatch) => {
    dispatch({type: ABORT_DESIRED_CAPS_EDITOR});
  };
}

export function saveRawDesiredCaps () {
  return (dispatch, getState) => {
    const state = getState().session;
    const {rawDesiredCaps, caps: capsArray} = state;
    try {
      const newCaps = JSON.parse(rawDesiredCaps);

      // Transform the current caps array to an object
      let caps = {};
      for (let {type, name, value} of capsArray) {
        caps[name] = {type, value};
      }

      // Translate the caps JSON to array format
      let newCapsArray = toPairs(newCaps).map(([name, value]) => ({
        type: (() => {
          let type = typeof value;

          // If we already have this cap and it's file type, keep the type the same
          if (caps[name] && caps[name].type === 'file' && type === 'string') {
            return 'file';
          } else if (type === 'string') {
            return 'text';
          } else {
            return type;
          }
        })(),
        name,
        value,
      }));
      dispatch({type: SAVE_RAW_DESIRED_CAPS, caps: newCapsArray});
    } catch (e) {
      dispatch({type: SHOW_DESIRED_CAPS_JSON_ERROR, message: e.message});
    }
  };
}

export function setRawDesiredCaps (rawDesiredCaps) {
  return (dispatch, getState) => {
    const state = getState().session;
    let isValidCapsJson = true;
    let invalidCapsJsonReason;
    if (state.isValidatingCapsJson) {
      try {
        JSON.parse(rawDesiredCaps);
      } catch (e) {
        isValidCapsJson = false;
        invalidCapsJsonReason = e.message;
      }
    }
    dispatch({type: SET_RAW_DESIRED_CAPS, rawDesiredCaps, isValidCapsJson, invalidCapsJsonReason});
  };
}

function removeNewSessionListeners () {
  ipcRenderer.removeAllListeners('appium-new-session-failed');
  ipcRenderer.removeAllListeners('appium-new-session-ready');
}

function removeRunningSessionsListeners () {
  ipcRenderer.removeAllListeners('appium-client-get-sessions-fail');
  ipcRenderer.removeAllListeners('appium-client-get-sessions-response');
}

export function addCloudProvider () {
  return (dispatch) => {
    dispatch({type: IS_ADDING_CLOUD_PROVIDER, isAddingProvider: true});
  };
}

export function stopAddCloudProvider () {
  return (dispatch) => {
    dispatch({type: IS_ADDING_CLOUD_PROVIDER, isAddingProvider: false});
  };
}

export function addVisibleProvider (provider) {
  return async (dispatch, getState) => {
    let currentProviders = getState().session.visibleProviders;
    const providers = union(currentProviders, [provider]);
    await settings.set(VISIBLE_PROVIDERS, providers);
    dispatch({type: SET_PROVIDERS, providers});
  };
}

export function removeVisibleProvider (provider) {
  return async (dispatch, getState) => {
    let currentProviders = getState().session.visibleProviders;
    const providers = without(currentProviders, provider);
    await settings.set(VISIBLE_PROVIDERS, providers);
    dispatch({type: SET_PROVIDERS, providers});
  };
}

export function setVisibleProviders () {
  return async (dispatch) => {
    const providers = await settings.get(VISIBLE_PROVIDERS);
    dispatch({type: SET_PROVIDERS, providers});
  };
}

/**
 * Check if Safari is started, if so add the includeSafariInWebviews
 * for future HTML detection
 *
 * @param {object} caps
 */
function includeSafariInWebviews (caps) {
  const {browserName = ''} = caps;
  const safariCapabilities = {
    includeSafariInWebviews: true,
  };

  return {
    ...caps,
    ...(browserName.toLowerCase() === 'safari' ? safariCapabilities : {}),
  };
}

/**
 * Check if Chrome is started, if so set the ChromeDriver to w3c:false because
 * all internal calls are still JSONWP calls
 *
 * @param {object} caps
 */
function setChromeDriverToJsonwp (caps) {
  const {browserName = ''} = caps;
  const chromeCapabilities = {
    nativeWebScreenshot: true,
    chromeOptions: {
      'w3c': false,
    },
  };

  return {
    ...caps,
    ...(browserName.toLowerCase() === 'chrome' ? chromeCapabilities : {}),
  };
}
