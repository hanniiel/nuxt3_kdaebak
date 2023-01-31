import { defineEventHandler, createError } from 'h3'

export default defineEventHandler(async (event) => {
    try {
        if (!event.context.user)
            throw createError({
                message: 'Not authenticaded',
                status: 401,
            })

        const body = await readBody(event)
        if (!body.currency) {
            throw createError('Currency not provided')
        }
        const user = event.context.user
        user.currency += body.currency
        const updatedUser = await user.save()
        return updatedUser
    } catch (e) {
        return createError('error on currency')
    }
})
