import express, {Request} from 'express'
import {useCookie, setCookie} from 'h3'
const router = express.Router()

router.get('/user', (req:Request, res) => {
    const cookie = useCookie(req, 'jwt')
    
    res.send(`${cookie || 'no cookie' }`)
})

export default router