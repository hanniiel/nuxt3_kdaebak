import { Router } from 'express'
import authFire from '../handlers/authFire'
import { Favorite } from '../models/favorite'

const router = Router()
router
    .route('/favorite/user')
    .get(authFire, async (req, res) => {
        try {
            let query = {
                ...req.query,
                user: req.user._id,
            }
            let result = await Favorite.find(query)
            res.send(result)
        } catch (error) {
            res.status(400).send({ error: error.message })
        }
    })
    .post(authFire, async (req, res) => {
        try {
            //source
            //postId
            let exists = await Favorite.findOne({
                ...req.body,
                user: req.user._id,
            })

            if (exists) {
                let result = await exists.remove()
                res.send(result)
            } else {
                let fave = new Favorite({
                    ...req.body,
                    user: req.user._id,
                })
                let result = await fave.save()
                res.send(result)
            }
        } catch (e) {
            res.send({ error: e.message })
        }
    })

export default router
