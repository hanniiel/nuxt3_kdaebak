import express from 'express'
import connect from '../server/connection'

connect()
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

import api from '../server/routers'

app.use(api.path, api.routes)

export default fromNodeMiddleware(app)
