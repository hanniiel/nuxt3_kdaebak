import { defineEventHandler, createError, getQuery } from 'h3'
import { Favorite } from '~~/server/models/favorite'
import validateAuth from '~~/server/validators/auth'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)
    try {
        let query = {
            ...getQuery(event),
            user: user._id,
        }
        const result = await Favorite.find(query)
        return result
    } catch (e: any) {
        return createError({ message: e.message })
    }
})
