import queue from '@rlanz/bull-queue/services/main';
import ResetPassword from '#events/reset_password';
import SendResetPasswordEmailJob from '../jobs/send_reset_password_email_job.js';

export default class SendResetPasswordEmail {
    handle(event: ResetPassword) {
        queue.dispatch(SendResetPasswordEmailJob, event.user)
    }
}