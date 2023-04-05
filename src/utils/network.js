import {
  CHECKING_SERVER,
  HTTP_GET_MAX_WAIT_TIME,
} from '../common/constants'

/**
 * determine if http code is authentication error
 * @param {number} httpCode
 * @return {boolean} true if not authenticated
 */
export function unAuthenticated(httpCode) {
  return ((httpCode === 403) || (httpCode === 401))
}

/**
 * do http fetch.  If error checks for that we have connection to server
 * @param {string} url
 * @param {object} authentication - optional authentication info
 * @param {number} timeout - optional timeout in milliseconds, defaults to HTTP_GET_MAX_WAIT_TIME
 * @param {boolean} noCache - if false then cached data can be used, if true then no caching.  Defaults to true
 * @return {Promise<object>} returns http response or throws exception if
 */
export function doFetch(server, url, authentication={}, timeout=HTTP_GET_MAX_WAIT_TIME, noCache=true) {
  const authConfig = authentication?.config || {}
  return get({
    url: url,
    config: {
      ...authConfig,
      timeout: timeout,
      server: server,
    },
    noCache: noCache,
    fullResponse: true,
  })
}

/**
 * in the case of any networking/http error, process and display error dialog
 * @param {string|Error} error - initial error message message or object
 * @param {number} httpCode - http code returned
 * @param {function} logout - invalidate current login
 * @param {object} router - to change to different web page
 * @param {function} setNetworkError - callback to toggle display of error popup
 * @param {function} setLastError - callback to save error details
 * @param {function} setErrorMessage - optional callback to apply error message
 */
export async function processNetworkError(error, httpCode, logout, router,
  setNetworkError, setLastError, setErrorMessage,
) {
  // TRICKY we need to show an initial message because there may be delays checking for server connection.
  //    if server responds, this message should be quickly replaced with final message
  const initialMessage = (typeof error === 'string') ? error : error?.message
  const initialShownError = {
    errorMessage: initialMessage + CHECKING_SERVER,
    lastError: error,
    router: router,
    logout: logout,
  }
  setNetworkError && setNetworkError(initialShownError) // clear until processing finished
  const errorObj = await getNetworkError(error, httpCode)
  setErrorMessage && setErrorMessage(errorObj.errorMessage)
  setLastError && setLastError(errorObj.lastError) // error info to attach to sendmail
  // add params needed for button actions
  errorObj.router = router
  errorObj.logout = logout
  setNetworkError && setNetworkError(errorObj) // this triggers network error popup
}
