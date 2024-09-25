/*
|--------------------------------------------------------------------------
| Define HTTP limiters
|--------------------------------------------------------------------------
|
| The "limiter.define" method creates an HTTP middleware to apply rate
| limits on a route or a group of routes. Feel free to define as many
| throttle middleware as needed.
|
*/

import limiter from '@adonisjs/limiter/services/main'

export const throttle = limiter.define('global', () => {
  return limiter.allowRequests(10).every('1 minute')
})

export const apiThrottle = limiter.define('api', (ctx) => {
  /**
   * Allow logged-in users to make 100 requests by
   * their user ID
   */
  if (ctx.auth.user) {
    return limiter
      .allowRequests(100)
      .every('1 minute')
      .usingKey(`api_user_${ctx.auth.user.id}`)
      .blockFor('5 mins')
  }

  /**
   * Allow guest users to make 10 requests by ip address
   */
  return limiter
    .allowRequests(50)
    .every('1 minute')
    .usingKey(`api_ip_${ctx.request.ip()}`)
    .blockFor('5 mins')
})

export const authThrottle = limiter.define('auth', (ctx) => {
  /**
   * Allow guest users to make 10 requests by ip address
   */
  return limiter
    .allowRequests(3)
    .every('1 minute')
    .usingKey(`auth_ip_${ctx.request.ip()}`)
    .blockFor('5 mins')
})