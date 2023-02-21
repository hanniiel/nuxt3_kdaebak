import { defineEventHandler, createError, readBody } from 'h3'
import { Vote } from '~~/server/models/vote'
import validateAuth from '~~/server/validators/auth'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)
    try {
        const body = await readBody(event)

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
            return createError('Get more hearts to vote')
        }
    } catch (e: any) {
        return createError(e.message)
    }
})
