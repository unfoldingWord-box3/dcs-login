# Login to DCS

This is a Login Component for use with Door43 Content Services (DCS).

```jsx
import AuthContextProvider from '../context/AuthContext.js'
import LoginForm from './LoginForm.js';

const Component = () => {

  const onSuccess = () => {
    alert(`onSuccess()`)
  }
  const onError = () => {
    alert(`onError()`)
  }
  const onGuest = () => {
    alert(`onError()`)
  }

  return (
    <AuthContextProvider>
    <LoginForm onSuccess={onSuccess} onGuest={onGuest}
      server={'https://qa.door43.org'} tokenid={'gatewayTranslate'}
    />
    </AuthContextProvider>
  )
}

<Component/>
```

