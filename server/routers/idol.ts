import { Request, Router } from 'express'
import { Idol } from '../models/idol'
const router = Router()

router.route('/idol').get(async (req, res) => {
    //
    try {
        let idols = await Idol.find({}, {}, { skip: 0 * 10, limit: 20 }).exec()
        res.status(200).send(idols)
    } catch (e) {
        res.status(400).send({ error: e })
    }
})

export default router
