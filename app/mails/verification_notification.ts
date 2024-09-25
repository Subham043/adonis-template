import User from '#models/user'
import { BaseMail } from '@adonisjs/mail'
import router from '@adonisjs/core/services/router'
import encryption from '@adonisjs/core/services/encryption'

export default class VerificationNotification extends BaseMail {
  from = 'no-reply@parcelcounter.in'
  subject = 'Verify your email address'

  constructor(private user: User) {
    super()
  }

  /**
   * The "prepare" method is called automatically when
   * the email is sent or queued.
   */
  prepare() {
    const encryptedId = encryption.encrypt(this.user.id, '7 days')
    const verificationUrl = router
      .builder()
      .prefixUrl('http://localhost:3333')
      .params({ id: encryptedId })
      .make('email.verify')
    this.message.to(this.user.email).htmlView('emails/verify_email', { user: this.user, verificationUrl })
  }
}