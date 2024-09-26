import UserRegistered from "#events/user_registered";
import User from "#models/user"
import db from "@adonisjs/lucid/services/db"

type ProfilePayload = {
    name: string;
    email: string;
}

type PasswordPayload = {
    password: string;
}

export default class AccountService {

    async findById(id: number): Promise<User>
    {
        return await User.findOrFail(id)
    }

    async resendVerificationMail(id: number): Promise<void>
    {
        const user = await User.query().where('id', id).whereNull('email_verified_at').firstOrFail()
        UserRegistered.dispatch(user);
    }

    async updateProfile(user: User, payload: ProfilePayload): Promise<User>
    {
        return await user.merge(payload).save()
    }

    async updatePassword(user: User, payload: PasswordPayload): Promise<void>
    {
        await user.merge(payload).save()
    }
    
    async logout(id: number): Promise<void>
    {
        const user = await User.findOrFail(id)
        await User.accessTokens.delete(user, user.id)
        await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
    }
}