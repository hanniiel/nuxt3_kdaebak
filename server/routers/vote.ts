import { Router } from 'express'
import authFire from '../handlers/authFire'
import { Vote } from '../models/vote'

const router = Router()

router.route('/vote').post(authFire, async (req, res) => {
    try {
        const user = req.user

        if (
            (user.currency > 0 && user.currency >= req.body.votes) ||
            (user.currency > 0 && req.body.votes == 0)
        ) {
            //override votes imp
            const votes = req.body.votes
            delete req.body.votes

            let vote = new Vote({
                ...req.body,
                user: req.user._id,
                votes: votes == 0 ? user.currency : votes,
            })

            if (votes == 0) {
                user.currency = 0
            } else {
                user.currency -= votes
            }
            await user.save()
            let saved = await vote.save()
            res.send(saved)
        } else {
            throw new Error('Get more hearts to vote')
        }
    } catch (e) {
        res.status(400).send({ error: e.message })
    }
})

export default router
