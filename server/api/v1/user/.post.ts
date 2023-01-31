import { defineEventHandler, createError } from 'h3'
import { User } from '~~/server/models/user'

export default defineEventHandler(async (event) => {
    try {
        let user = new User(await readBody(event))
        user.role = 'user'
        const token = await user.genAuthToken()
        return { user, token }
    } catch (e) {
        throw createError({ message: 'Bad request', status: 400 })
    }
})
