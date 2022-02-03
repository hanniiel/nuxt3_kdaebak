import express from 'express'
import connect from '../models/connection'
connect()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import userRoute from '../routers/user'
import idolRoute from '../routers/idol'

app.use('/api', userRoute)
app.use('/api', idolRoute)

app.get('/holis', (req, res) => {
    res.send('holis')
})

export default app