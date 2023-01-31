import mongoose from 'mongoose'
import { initializeApp, cert } from 'firebase-admin/app'

export default async function connect() {
    try {
        const config = useRuntimeConfig()

        await mongoose.connect(config.mongoPath)
        initializeApp({
            credential: cert(config.googleApplicationCredentials),
            databaseURL: 'https://kdaebakapp.firebaseio.com',
        })
        console.log('Connected to mongo')
    } catch (e) {
        console.log(e)
    }
}
connect
