import config from '#config'
import express from 'express'
import connect from '../models/connection'
import { initializeApp, cert } from 'firebase-admin/app';

initializeApp({
  credential: cert(JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS)),
  databaseURL: "https://kdaebakapp.firebaseio.com"
});
connect()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import userRoute from '../routers/user'
import idolRoute from '../routers/idol'
import groupRoute from '../routers/group'

app.use('/api', userRoute)
app.use('/api', idolRoute)
app.use('/api', groupRoute)

app.get('/holis', (req, res) => {
    res.send('holis')
})

export default app