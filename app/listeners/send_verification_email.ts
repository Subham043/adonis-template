import queue from '@rlanz/bull-queue/services/main';
import SendVerificationEmailJob from '../jobs/send_verification_email_job.js';
import UserRegistered from '#events/user_registered';

export default class SendVerificationEmail {
    handle(event: UserRegistered) {
        queue.dispatch(SendVerificationEmailJob, event.user)
    }
}