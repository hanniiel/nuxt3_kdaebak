import { defineEventHandler, createError, readBody } from 'h3'
import validateAuth from '~~/server/validators/auth'
import { Idol } from '~~/server/models/idol'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)

    try {
        if (user.role != 'admin') {
            return createError({ message: 'role not authorized' })
        }

        const body = await readBody(event)

        let idol = new Idol({
            ...body,
        })

        const result = await idol.save()
        return result
    } catch (error: any) {
        return createError({ message: error.message })
    }
})
