import vine from '@vinejs/vine'
import { verifyOldPasswordRule } from '../rule/verify_old_password.js'

/**
 * Validates the user's profile update action
 */
export const accountProfileValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email().unique(async (db, value, field) => {
            const user = await db
                .from('users')
                .whereNot('id', field.meta.userId)
                .where('email', value)
                .first()
            return !user
        }),
        name: vine.string().trim(),
    })
)

/**
 * Validates the user's password update action
 */
export const accountPasswordValidator = vine.compile(
    vine.object({
        old_password: vine.string().trim().use(verifyOldPasswordRule()),
        password: vine.string().trim().confirmed({
            confirmationField: 'password_confirmation',
        }),
    })
)