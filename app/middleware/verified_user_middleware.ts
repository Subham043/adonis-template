import { Authenticators } from '@adonisjs/auth/types'
import { Exception } from '@adonisjs/core/exceptions'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class VerifiedUserMiddleware {
  /**
   * The URL to redirect to, when authentication fails
   */
  redirectTo = '/login'

  async handle(
    ctx: HttpContext, 
    next: NextFn,
    options: {
      guards?: (keyof Authenticators)[]
    } = {}
  ) {
    /**
     * Middleware logic goes here (before the next call)
     */
    const auth = await ctx.auth.authenticateUsing(options.guards, { loginRoute: this.redirectTo })
    if(auth.emailVerifiedAt){
      return next()
    }
    throw new Exception('Email is not verified', {
      status: 403,
    })
  }
}