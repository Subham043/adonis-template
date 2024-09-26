import { Job } from '@rlanz/bull-queue'
import mail from '@adonisjs/mail/services/main'
import ResetPasswordNotification from '#mails/reset_password_notification'
import User from '#models/user'

export default class SendResetPasswordEmailJob extends Job {
  // This is the path to the file that is used to create the job
  static get $$filepath() {
    return import.meta.url
  }

  /**
   * Base Entry point
   */
  async handle(user: User) {
    await mail.send(new ResetPasswordNotification(user))
  }

  /**
   * This is an optional method that gets called when the retries has exceeded and is marked failed.
   */
  async rescue() {}
}