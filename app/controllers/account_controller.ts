import type { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import AccountService from '#services/account_service'
import { accountPasswordValidator, accountProfileValidator } from '#validators/account'


@inject()
export default class AccountController {

    constructor(
        private accountService: AccountService
    ) { }

    async profile({ response, auth }: HttpContext) {
        const id = auth.user!.id!
        const user = await this.accountService.findById(id)
        return response.ok({
            success: true,
            data: user.serialize(),
        })
    }

    async resendVerificationMail({ response, auth }: HttpContext) {
        const id = auth.user!.id!
        await this.accountService.resendVerificationMail(id)
        return response.ok({
            success: true,
            message: 'Verification mail sent',
        })
    }

    async updateProfile({ request, response, auth }: HttpContext) {
        const id = auth.user!.id!
        const payload = await request.validateUsing(accountProfileValidator, {
            meta: { userId: id }
        });
        const profile = await this.accountService.findById(id)
        const user = await this.accountService.updateProfile(profile, payload)
        return response.ok({
            success: true,
            data: user.serialize(),
        })
    }

    async updatePassword({ request, response, auth }: HttpContext) {
        const id = auth.user!.id!
        const profile = await this.accountService.findById(id)
        const payload = await request.validateUsing(accountPasswordValidator, {
            meta: { current_password: profile.password }
        });
        await this.accountService.updatePassword(profile, { password: payload.password })
        return response.ok({
            success: true,
            message: 'Password updated successfully',
        })
    }

    async logout({ response, auth }: HttpContext) {
        const id = auth.user!.id!
        await this.accountService.logout(id)
        return response.ok({
            success: true,
            message: 'User logged out',
        })
    }
}