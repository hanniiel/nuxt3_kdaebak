import { defineEventHandler, createError, readBody } from 'h3'
import { Vote } from '~~/server/models/vote'

export default defineEventHandler(async (event) => {
    try {
        if (!event.context.user) throw createError('Not authenticated')

        const body = await readBody(event)

        let user = event.context.user

        if (
            (user.currency > 0 && user.currency >= body.votes) ||
            (user.currency > 0 && body.votes == 0)
        ) {
            //override votes imp
            const votes = body.votes
            delete body.votes

            let vote = new Vote({
                ...body,
                user: user._id,
                votes: votes == 0 ? user.currency : votes,
            })

            if (votes == 0) {
                user.currency = 0
            } else {
                user.currency -= votes
            }
            await user.save()
            let saved = await vote.save()

            return saved
        } else {
            throw createError('Get more hearts to vote')
        }
    } catch (e) {
        throw e
    }
})
