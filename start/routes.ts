/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import { apiThrottle, authThrottle } from '#start/limiter'
const AuthController = () => import('#controllers/auth_controller')
const AccountController = () => import('#controllers/account_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [AuthController, 'login']).use(authThrottle)
        router.post('/register', [AuthController, 'register']).use(authThrottle)
        router.post('/forgot-password', [AuthController, 'forgotPassword']).use(authThrottle)
        router.post('/reset-password/:id', [AuthController, 'resetPassword']).use(authThrottle).as('reset.password')
        router.get('/verify/:id', [AuthController, 'verifyEmail']).use(apiThrottle).as('email.verify')
      })
      .prefix('/auth')
    router
      .group(() => {
        router.get('/profile', [AccountController, 'profile'])
        router.get('/resend-verification-mail', [AccountController, 'resendVerificationMail'])
        router.post('/logout', [AccountController, 'logout'])
        router.group(() => {
          router.put('/profile', [AccountController, 'updateProfile'])
          router.put('/password', [AccountController, 'updatePassword'])
        }).prefix('/update')
      })
      .use(middleware.auth({
        guards: ['api']
      }))
      .use(apiThrottle)
      .prefix('/account')
  })
  .prefix('/api')