import { defineEventHandler, createError, getRouterParams } from 'h3'
import { Favorite } from '~~/server/models/favorite'
export default defineEventHandler(async (event) => {
    const { source, post } = getRouterParams(event)

    try {
        if (!source || !post) {
            return createError({ message: 'source & post not specified' })
        }
        let count = await Favorite.countDocuments({
            source: source,
            post: post,
        }).exec()
        return { count }
    } catch (e: any) {
        return createError({ message: e.message })
    }
})
