import {
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
