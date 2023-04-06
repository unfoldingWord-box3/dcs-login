import React, { useContext, useState, useEffect } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import PersonIcon from '@mui/icons-material/Person'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import Button from '@mui/material/Button'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Link from '@mui/material/Link'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'

import SettingsForm from '../common/SettingsForm'
import { PASSWORD_RECOVERY_LINK, SIGNUP_LINK } from '../common/constants'
import { AuthContext } from '../context/AuthContext'

const LoginForm = ({ onSuccess, onError, onGuest, server, tokenid }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const {
    state: { authentication, networkError, error, isLoadingRemote },
    actions: { onLoginFormSubmit, onLoginFormSubmitLogin, logout, setServer, setTokenid, setErrorReturn },
  } = useContext(AuthContext)

  useEffect( () => {
    // Note: the set state functions have to wait until
    // the login component is rendered before updating
    // the context. So this useEffect wrapper
    setServer(server)
    setTokenid(tokenid)
    // setErrorReturn(onError)
  }, [setServer, setTokenid, setErrorReturn])

  const [keepLoggedIn, setKeepLoggedIn] = useState(
    authentication?.remember || false
  )

  const handleLogin = () => {
    if (username && password) {
      onLoginFormSubmitLogin({ username, password, remember: keepLoggedIn })
    }
  }

  useEffect(() => {
    if (!!authentication?.token && onSuccess) {
      console.log('New token found:', { newToken: authentication?.token.sha1 })
      onSuccess()
    }
  }, [authentication?.token, onSuccess])

  const [disabled, setDisabled] = useState()

  useEffect(() => {
    setDisabled(isLoadingRemote || !!authentication?.token.sha1)
  }, [isLoadingRemote, authentication?.token.sha1])

  const handleLogout = () => {
    logout()
    onLoginFormSubmit({ username: null, password: null })
    setPassword('')
  }

  const handleKeepLoggedIn = event => {
    setKeepLoggedIn(event.target.checked)
  }

  return (
    <>
      <SettingsForm
        isLoading={isLoadingRemote}
        error={!!networkError?.errorMessage || !!error}
        icon={AccountCircleIcon}
        label={'Login'}
        errorMessage={networkError?.errorMessage || error}
      >
        <TextField
          sx={{ my: 1 }}
          required
          disabled={disabled}
          id='name'
          label={'Username'}
          defaultValue={authentication?.user?.login}
          fullWidth={true}
          onChange={e => setUsername(e.target.value)}
          inputProps={{
            style: {
              borderRadius: 'unset',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <PersonIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          sx={{ my: 1 }}
          required
          disabled={disabled}
          id='password'
          type='password'
          label={'Password'}
          value={password}
          fullWidth={true}
          onChange={e => setPassword(e.target.value)}
          inputProps={{
            style: {
              borderRadius: 'unset',
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <VpnKeyIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <Link
                target='_blank'
                href={PASSWORD_RECOVERY_LINK}
                variant='caption'
              >
                {'Forgot password?'}
              </Link>
            ),
          }}
        />

        <FormControlLabel
          label={
            <Typography variant='caption'>{'Keep me logged in'}</Typography>
          }
          control={
            <Checkbox
              //size="small"
              //disabled={disabled && settings.saveToken}
              onChange={handleKeepLoggedIn}
              checked={keepLoggedIn || false}
            />
          }
        />

        <Stack spacing={2} direction='row' sx={{ mt: '1rem' }}>
          <Button
            disabled={disabled}
            color='primary'
            variant='contained'
            onClick={handleLogin}
            sx={{ flex: 1 }}
          >
            {isLoadingRemote ? (
              <>
                <CircularProgress size='1rem' sx={{ mr: '0.5rem' }} />{' '}
                {'Loading...'}
              </>
            ) : (
              'Login'
            )}
          </Button>
          {authentication?.token?.sha1 && (
            <Button variant='outlined' onClick={handleLogout} sx={{ flex: 1 }}>
              {'Logout'}
            </Button>
          )}
        </Stack>
      </SettingsForm>
      <Typography variant='caption'>
        {'Need an account?'}{' '}
        <Link target='_blank' href={SIGNUP_LINK}>
          {'Register now'}
        </Link>
      </Typography>
    </>
  )
}

export default LoginForm
