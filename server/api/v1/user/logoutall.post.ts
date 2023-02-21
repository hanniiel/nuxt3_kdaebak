import {
    defineEventHandler,
    sendNoContent,
    createError,
    deleteCookie,
} from 'h3'
import validateAuth from '~~/server/validators/auth'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)

    try {
        user.tokens = []
        await user.save()
        deleteCookie(event, 'jwt')
        return sendNoContent(event)
    } catch (e: any) {
        createError({ message: 'Bad request ' + e.message })
    }
})
