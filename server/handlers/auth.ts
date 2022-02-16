import config from '#config'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { Request } from 'express'

const auth = async (req: Request, res, next) => {
    try {
        let token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, config.JWT_KEY)
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token,
        })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Failed to authenticate' })
    }
}

export default auth
