import emitter from '@adonisjs/core/services/emitter'

import UserRegistered from '#events/user_registered'
import ResetPassword from '#events/reset_password'
const SendVerificationEmail = () => import('#listeners/send_verification_email')
const SendResetPasswordEmail = () => import('#listeners/send_reset_password_email')

emitter.on(UserRegistered, [SendVerificationEmail])
emitter.on(ResetPassword, [SendResetPasswordEmail])
