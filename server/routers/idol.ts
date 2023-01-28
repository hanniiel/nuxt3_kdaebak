import { Request, Router } from 'express'

const router = Router()

router.route('/idol').get(async (req, res) => {
    //
    try {
        res.send({ succes: true })
    } catch (e) {
        res.status(400).send({ error: e })
    }
})

export default router
