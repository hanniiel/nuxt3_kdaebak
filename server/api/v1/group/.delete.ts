import { defineEventHandler, createError, getQuery, sendNoContent } from 'h3'
import validateAuth from '~~/server/validators/auth'
import { Group } from '~~/server/models/group'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)
    try {
        if (user.role != 'admin') {
            return createError({ message: 'not authorized' })
        }
        const query = getQuery(event)

        const id = query.id
        if (!id) {
            return createError('id not provided')
        }
        const result = await Group.deleteOne({ _id: id })
        if (result.deletedCount > 0) {
            return sendNoContent(event, 200)
        } else {
            return createError('no item deleted')
        }
    } catch (error) {
        return createError('error on delete group')
    }
})
