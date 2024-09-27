import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'
import router from '@adonisjs/core/services/router'
import encryption from '@adonisjs/core/services/encryption'
import env from '#start/env'

export default class ResetPasswordNotification extends BaseMail {
  from = 'no-reply@parcelcounter.in'
  subject = 'Reset Password'

  constructor(private user: User) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const encryptedId = encryption.encrypt(this.user.id, '20 minutes')
    const verificationUrl = router
      .builder()
      .prefixUrl(env.get('APP_URL'))
      .params({ id: encryptedId })
      .make('reset.password')
    this.message.to(this.user.email).htmlView('emails/reset_password_email', { user: this.user, verificationUrl })
  }
}