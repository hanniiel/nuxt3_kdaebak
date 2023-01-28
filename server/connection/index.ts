import mongoose from 'mongoose'
const config = useRuntimeConfig()

export default async function connect() {
    try {
        await mongoose.connect(config.mongoPath)
        console.log('Connected to mongo')
    } catch (e) {
        console.log(e)
    }
}
