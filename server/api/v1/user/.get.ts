import { defineEventHandler, createError, H3Event } from 'h3'
import validateAuth from '~~/server/validators/auth'

export default defineEventHandler((event: H3Event) => {
    return validateAuth(event)
})
