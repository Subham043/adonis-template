import type { HttpContext } from '@adonisjs/core/http'
import {
    userRegistrationValidator,
    userLoginValidator
} from '#validators/user'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db';
import UserRegistered from '#events/user_registered';
import encryption from '@adonisjs/core/services/encryption'
import { DateTime } from 'luxon';

export default class UsersController {
    async login({ request, response }: HttpContext) {
        const { email, password } = await request.validateUsing(userLoginValidator);
        const user = await User.verifyCredentials(email, password)
        const token = await User.accessTokens.create(user)
        return response.ok({
            ...user.serialize(),
            token
        })
    }

    async register({ request, response }: HttpContext) {
        const payload = await request.validateUsing(userRegistrationValidator);
        const user = await User.create(payload);
        UserRegistered.dispatch(user)
        return response.created(user)
    }

    async verifyEmail({ response, params }: HttpContext) {
        const id = encryption.decrypt(params.id) as number;
        const user = await User.query().where('id', id).whereNull('email_verified_at').firstOrFail();
        await user.merge({ emailVerifiedAt: DateTime.local() }).save()
        return response.ok({
            success: true,
            message: 'Email verified successfully',
        })
    }

    async logout({ response, auth }: HttpContext) {
        const getUser = auth.user?.id
        const user = await User.findOrFail(getUser)
        await User.accessTokens.delete(user, user.id)

        await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()

        return response.ok({
            success: true,
            message: 'User logged out',
        })
    }
}