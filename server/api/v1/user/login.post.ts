import { defineEventHandler, readBody, createError } from 'h3'
import { User } from '~~/server/models/user'

export default defineEventHandler(async (event) => {
    const { email, password } = await readBody(event)
    try {
        let user = await User.findByCredentials(email, password)
        let token = await user.genAuthToken()

        return { user, token }
    } catch (e) {
        return createError({ message: 'Bad request login', status: 500 })
    }
})
