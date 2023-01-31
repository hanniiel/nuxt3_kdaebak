import { defineEventHandler, createError } from 'h3'
import { User } from '~~/server/models/user'

export default defineEventHandler(async (event) => {
    try {
        if (!event.context.user)
            throw createError({
                message: 'Not authenticaded',
                status: 401,
            })
        //valdiate params to update
        const body = await readBody(event)
        let updates = Object.keys(body)
        let allowed = ['email', 'name']
        let isValid = updates.every((key) => allowed.includes(key))
        if (!isValid) {
            return createError({
                message: 'update operation not allowed',
                status: 400,
            })
        }
        const user = await User.findByIdAndUpdate(body.user._id, body, {
            new: true,
            runValidators: true,
        })
        return user
    } catch (e) {
        return createError({
            message: 'error update user',
            status: 500,
        })
    }
})
