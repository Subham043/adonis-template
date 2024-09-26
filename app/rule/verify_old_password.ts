import vine from '@vinejs/vine'
import { FieldContext } from '@vinejs/vine/types'
import hash from '@adonisjs/core/services/hash'

/**
 * Options accepted by the unique rule
 */
type Options = undefined;

/**
 * Implementation
 */
async function verify_old_password(
  value: unknown,
  _options: Options,
  field: FieldContext
) {
  /**
   * We do not want to deal with non-string
   * values. The "string" rule will handle the
   * the validation.
   */
  if (typeof value !== 'string') {
    return
  }
  
  const isPasswordValid = await hash.verify(field.meta.current_password, value)
  if (!isPasswordValid) {
    field.report(
      'The {{ field }} field does not match the existing password.',
      'verify_old_password',
      field
    )
  }
}

/**
 * Converting a function to a VineJS rule
 */
export const verifyOldPasswordRule = vine.createRule(verify_old_password)
