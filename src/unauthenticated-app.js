import * as React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'

import {AuthForm} from 'components/auth-form'
import {LanguagePicker} from 'components/language-picker'
import {Spinner} from 'components/lib'
import {useAppDispatch, useAppState} from 'context/auth-context'
import {client} from 'util/api-client'

function UnauthenticatedApp() {
  return (
    <Switch>
      <Route exact path="/authorize" component={APIRedirectLandingScreen} />
      <Route exact path="/" component={AuthScreen} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  )
}

function AuthScreen() {
  return (
    <div className="flex min-h-screen bg-indigo-50 text-gray-700">
      <LanguagePicker />
      <AuthForm />
    </div>
  )
}

function APIRedirectLandingScreen() {
  const params = new URLSearchParams(window.location.search)
  const authorizationCode = params.get('code')

  const {clientId, clientSecret} = useAppState()
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    if (authorizationCode) {
      const config = {
        formData: {
          grant_type: 'authorization_code',
          code: authorizationCode,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: `${process.env.REACT_APP_URL}/authorize`,
        },
      }
      client('security/oauth/token', config)
        .then(response => {
          dispatch({type: 'storeAccessAndRefreshTokens', payload: response})
        })
        .catch(error => console.log(error))
    }
  }, [authorizationCode, clientId, clientSecret, dispatch])

  return (
    <div className="flex min-h-screen bg-indigo-50 text-gray-700">
      <Spinner />
    </div>
  )
}

export default UnauthenticatedApp
