import { UserApi } from 'dcs-js'

const deletePreviousTokens = async ({ username, config, userClient }) => {
  const previousTokens = await userClient
    .userGetTokens({ username })
    .then(({ data }) => data)

  if (!previousTokens?.length) return false

  previousTokens.forEach(token => {
    if (token.name === config.tokenid)
      userClient.userDeleteAccessToken({ username, token: token.id })
  })

  return true
}

const getToken = async ({ username, password, config, userClient }) => {
  try {
    await deletePreviousTokens({ username, password, config, userClient })
    const { data: token } = await userClient
      .userCreateToken({
        username,
        userCreateToken: { name: config.tokenid },
      })  
    return token
  } catch (e) {
    return null
  }

}

const getUser = async ({ userClient, username }) => {
  try {
    const user = await userClient.userGetCurrent()
    .then(({ data }) => data)
    return user
  } catch (e) {
    // A network error looks like this:
    // getUser() error: Error: Network Error
    console.log("getUser() error:",e.message)
    if ( e.message.startsWith("Network Error") ) {
      throw e
    }
    return null
  }
}

export const getUserAuth = async ({ username, password, config }) => {
  console.log(config)
  const basePath = config.server + '/api/v1'
  const userClient = new UserApi({ basePath, username, password })
  // need to await so that getToken is attempted when user is unknown
  const user = await getUser({ userClient, username })
  // no need to attempt to get a token if getUser() fails
  const token = user ? await getToken({ username, password, config, userClient }) : null
  return {
    token: token,
    user: user,
  }
}
