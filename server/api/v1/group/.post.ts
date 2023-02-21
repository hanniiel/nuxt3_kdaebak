import { defineEventHandler, createError, readBody } from 'h3'
import validateAuth from '~~/server/validators/auth'
import { Group } from '~~/server/models/group'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)
    try {
        if (user.role != 'admin') {
            return createError({ message: 'not authorized' })
        }

        const body = await readBody(event)
        const group = new Group(body)
        const result = await group.save()

        return result
    } catch (e: any) {
        return createError({ message: e.message })
    }
})
