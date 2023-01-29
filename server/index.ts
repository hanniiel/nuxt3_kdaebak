import express, { Router } from 'express'
import connect from '../server/connection'

connect()
const app = express()

const testRouter = Router()
testRouter.get('/', (req, res) => res.status(200).json({ route: '/api/test' }))

// You **must** add `/api` prefix (same as nuxt.config).
// Maybe you can use global prefix with express, never used it
app.use('/api/test', testRouter)

export default fromNodeMiddleware(app)
