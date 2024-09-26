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
        router.post('/forgot-password', [AuthController, 'forgot_password']).use(authThrottle)
        router.get('/verify/:id', [AuthController, 'verifyEmail']).use(apiThrottle).as('email.verify')
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth({
          guards: ['api']
        })).use(apiThrottle)
      })
      .prefix('/auth')
  })
  .prefix('/api')