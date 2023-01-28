import express from 'express'
import connect from '../connection'

import { initializeApp, cert } from 'firebase-admin/app'
const config = useRuntimeConfig()
initializeApp({
    credential: cert(config.googleApplicationCredentials),
    databaseURL: 'https://kdaebakapp.firebaseio.com',
})
connect()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import api from '../routers'

app.use(api.path, api.routes)

export default fromNodeMiddleware(app)
