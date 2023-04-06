import React, { createContext, useState } from 'react'
import localforage from 'localforage'
import {
  HTTP_GET_MAX_WAIT_TIME,
  SERVER_KEY,
  TOKEN_ID,
} from '../common/constants';
import { doFetch, unAuthenticated } from '../utils/network';
import useLocalStorage from '../hooks/useLocalStorage';
import useAuthentication from '../hooks/useAuthentication';

export const AuthContext = createContext({})

export default function AuthContextProvider(props) {
  const [authentication, setAuthentication] = useState(null)
  const [server, setServer] = useLocalStorage(SERVER_KEY, '')
  const [tokenid, setTokenid] = useLocalStorage(TOKEN_ID, '')

  const myAuthStore = localforage.createInstance({
    driver: [localforage.INDEXEDDB],
    name: 'my-auth-store',
  })

  const getAuth = async () => {
    const auth = await myAuthStore.getItem('authentication')

    if (auth) {
      // verify that auth is still valid
      doFetch(server, `${server}/api/v1/user`, auth, HTTP_GET_MAX_WAIT_TIME)
        .then(response => {
          const httpCode = response?.status || 0

          if (httpCode !== 200) {
            console.log(
              `TranslationSettings - error fetching user info, status code ${httpCode}`
            )

            if (unAuthenticated(httpCode)) {
              console.log(
                `TranslationSettings - user not authenticated, going to login`
              )
              logout()
            } else {
              logout()
            }
          }
        })
        .catch(e => {
          console.warn(
            `TranslationSettings - hard error fetching user info, error=`,
            e
          )
          logout()
        })
    }
    return auth
  }

  const saveAuth = async authentication => {
    if (authentication === undefined || authentication === null) {
      await myAuthStore.removeItem('authentication')
    } else {
      await myAuthStore
        .setItem('authentication', authentication)
        .then(function (authentication) {
          console.info(
            'saveAuth() success. authentication user is:',
            authentication.user.login
          )
        })
        .catch(function (err) {
          // This code runs if there were any errors
          console.info('saveAuth() failed. err:', err)
          console.info('saveAuth() failed. authentication:', authentication)
        })
    }
  }

  const onError = e => {
    console.warn('AuthContextProvider - auth error', e)
    // errorReturn && errorReturn(e.toString())
    // processError(e?.errorMessage)
  }

  async function logout() {
    await myAuthStore.removeItem('authentication')
    setAuthentication(null)
  }

  const { state, actions, config } = useAuthentication({
    authentication,
    onAuthentication: setAuthentication,
    config: {
      server,
      tokenid,
      timeout: HTTP_GET_MAX_WAIT_TIME,
    },
    messages: props.messages,
    loadAuthentication: getAuth,
    saveAuthentication: saveAuth,
    onError,
  })

  const value = {
    state: {
      ...state,
      // networkError,
      server,
    },
    actions: {
      ...actions,
      logout,
      // setNetworkError,
      setServer,
      setTokenid,
      // setErrorReturn,
    },
    config,
  }

  return (
    <AuthContext.Provider value={value}>
      {props.children}
    </AuthContext.Provider>
  )
}
