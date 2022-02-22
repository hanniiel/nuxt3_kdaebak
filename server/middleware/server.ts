import config from '#config'
import express from 'express'
import connect from '../models/connection'
import { initializeApp, cert } from 'firebase-admin/app'

initializeApp({
    credential: cert(config.GOOGLE_APPLICATION_CREDENTIALS),
    databaseURL: 'https://kdaebakapp.firebaseio.com',
})
connect()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import api from '../routers/'

app.use(api.path, api.routes)

export default app
