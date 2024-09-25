import vine from '@vinejs/vine'

/**
 * Validates the user's authentication action
 */
export const userLoginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string().trim(),
    })
)

/**
 * Validates the user's registration action
 */
export const userRegistrationValidator = vine.compile(
    vine.object({
        name: vine.string().trim().escape().minLength(1),
        email: vine.string().trim().email().unique(async (db, value, _field) => {
            const user = await db
                .from('users')
                //   .whereNot('id', field.meta.userId)
                .where('email', value)
                .first()
            return !user
        }),
        password: vine.string().trim().confirmed({
            confirmationField: 'password_confirmation',
        }),
    })
)