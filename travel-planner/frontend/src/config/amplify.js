/**
 * AWS Amplify v6 Configuration for Cognito Authentication
 *
 * Set these in frontend/.env:
 *   VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
 *   VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
 *   VITE_COGNITO_DOMAIN=your-app.auth.us-east-1.amazoncognito.com  (for social login)
 *
 * If these are empty, the app runs in "local demo" mode (localStorage auth).
 */
import { Amplify } from 'aws-amplify'

const poolId   = import.meta.env.VITE_COGNITO_USER_POOL_ID
const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID
const domain   = import.meta.env.VITE_COGNITO_DOMAIN

export const COGNITO_ENABLED = !!(poolId && clientId)

if (COGNITO_ENABLED) {
  const authConfig = {
    Cognito: {
      userPoolId: poolId,
      userPoolClientId: clientId,
    },
  }

  // Social login (Google / GitHub) requires a Cognito Hosted UI domain
  if (domain) {
    authConfig.Cognito.loginWith = {
      oauth: {
        domain,
        scopes: ['openid', 'email', 'profile'],
        redirectSignIn:  [window.location.origin + '/'],
        redirectSignOut: [window.location.origin + '/'],
        responseType: 'code',
      },
    }
  }

  Amplify.configure({ Auth: authConfig })
  console.log('✓ Amplify configured — Cognito enabled')
} else {
  console.log('ℹ Cognito env vars not set — running in local demo mode')
}
