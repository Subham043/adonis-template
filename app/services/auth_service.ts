import ResetPassword from '#events/reset_password';
import UserRegistered from '#events/user_registered';
import User from '#models/user'
import { AccessToken } from '@adonisjs/auth/access_tokens'
import db from '@adonisjs/lucid/services/db';
import { DateTime } from 'luxon';

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
}

type ForgotPasswordPayload = {
    email: string;
}

export default class UserService {
    async authenticate(email: string, password: string): Promise<User>
    {
      return await User.verifyCredentials(email, password)
    }
    
    async generateAccessToken(user: User): Promise<AccessToken>
    {
      return await User.accessTokens.create(user)
    }
    
    async registration(payload: RegisterPayload): Promise<User>
    {
      const user = await User.create(payload)
      UserRegistered.dispatch(user);
      return user
    }
    
    async findUnverifiedUserById(id: number): Promise<User>
    {
      return await User.query().where('id', id).whereNull('email_verified_at').firstOrFail();
    }
    
    async findByEmail(email: string): Promise<User>
    {
      return await User.query().where('email', email).firstOrFail();
    }

    async forgotPassword(payload: ForgotPasswordPayload): Promise<void>
    {
      const user = await this.findByEmail(payload.email)
      ResetPassword.dispatch(user);
    }
    
    async verifyUser(user: User): Promise<void>
    {
        await user.merge({ emailVerifiedAt: DateTime.local() }).save()
    }

    async logout(id: number): Promise<void>
    {
        const user = await User.findOrFail(id)
        await User.accessTokens.delete(user, user.id)
        await db.from('auth_access_tokens').where('tokenable_id', user.id).delete()
    }
  }