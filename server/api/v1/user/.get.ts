import { defineEventHandler, createError } from 'h3'

export default defineEventHandler((event) => {
    if (!event.context.user)
        throw createError({ message: 'Not authenticaded', status: 401 })

    return event.context.user
})
