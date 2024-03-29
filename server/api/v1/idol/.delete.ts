import { defineEventHandler, createError, getQuery, sendNoContent } from 'h3'
import validateAuth from '~~/server/validators/auth'
import { Idol } from '~~/server/models/idol'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)

    try {
        if (user.role != 'admin') {
            return createError({ message: 'not authorized' })
        }
        const query = getQuery(event)
        let id = query.id
        if (!id) {
            return createError('id not provided')
        }
        let result = await Idol.deleteOne({ _id: id })
        if (result.deletedCount > 0) {
            return sendNoContent(event, 200)
        } else {
            return createError('no item deleted')
        }
    } catch (error: any) {
        return createError('delete user ' + error.message)
    }
})
