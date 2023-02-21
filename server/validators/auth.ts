import { H3Event, createError, H3Error } from 'h3'

export default function validateAuth(event: H3Event): H3Error | any {
    if (!event.context.user) {
        throw createError({
            message: 'Not Authenticated',
            status: 401,
        })
    }
    return event.context.user
}
