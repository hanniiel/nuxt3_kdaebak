import { defineEventHandler, createError, readBody } from 'h3'
import { Favorite } from '~~/server/models/favorite'
import validateAuth from '~~/server/validators/auth'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)
    try {
        const body = await readBody(event)

        let exists = await Favorite.findOne({
            ...body,
            user: user._id,
        })

        if (exists) {
            const result = await exists.remove()
            return result
        } else {
            let fave = new Favorite({
                ...body,
                user: user._id,
            })
            const result = await fave.save()
            return result
        }
    } catch (e: any) {
        return createError({ message: e.message })
    }
})
