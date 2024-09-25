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
const UsersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {
        router.post('/login', [UsersController, 'login']).use(authThrottle)
        router.post('/register', [UsersController, 'register']).use(authThrottle)
        router.get('/verify/:id', [UsersController, 'verifyEmail']).use(apiThrottle).as('email.verify')
        router.post('/logout', [UsersController, 'logout']).use(middleware.auth({
          guards: ['api']
        })).use(apiThrottle)
      })
      .prefix('/auth')
  })
  .prefix('/api')