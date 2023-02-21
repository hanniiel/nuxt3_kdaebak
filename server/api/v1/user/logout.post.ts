import {
    defineEventHandler,
    createError,
    deleteCookie,
    sendNoContent,
} from 'h3'
import validateAuth from '~~/server/validators/auth'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)

    try {
        user.tokens = user.tokens.filter((token: any) => {
            return token.token !== event.context.token
        })
        deleteCookie(event, 'jwt')
        await user.save()
        return sendNoContent(event)
    } catch (e: any) {
        return createError({ message: 'Bad request ' + e.message })
    }
})
