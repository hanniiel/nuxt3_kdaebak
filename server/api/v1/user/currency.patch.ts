import { defineEventHandler, createError } from 'h3'
import validateAuth from '~~/server/validators/auth'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)

    try {
        const body = await readBody(event)
        if (!body.currency) {
            return createError('Currency not provided')
        }

        user.currency += body.currency
        const updatedUser = await user.save()
        return updatedUser
    } catch (e: any) {
        return createError('error on currency')
    }
})
