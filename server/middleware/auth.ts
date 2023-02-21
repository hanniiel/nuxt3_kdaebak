import { defineEventHandler, getCookie, H3Event } from 'h3'
import { User } from '../models/user'
import admin from 'firebase-admin'

export default defineEventHandler(async (event: H3Event) => {
    const { req } = event.node
    if (!req.headers.authorization) {
        const cookie = getCookie(event, 'jwt')
        if (cookie) {
            req.headers.authorization = `Bearer ${cookie}`
            await appendUser(event, cookie)
        }
    } else {
        await appendUser(
            event,
            req.headers.authorization.replace('Bearer ', '')
        )
    }
})

async function appendUser(event: H3Event, token: string) {
    try {
        let authUser = await admin.auth().verifyIdToken(token)
        const user = await User.findById(authUser.uid)

        if (!user) {
            const fireUser = await admin.auth().getUser(authUser.uid)
            const newUser = new User({
                email: authUser.email,
                name: fireUser.displayName,
            })
            newUser._id = fireUser.uid
            event.context.user = await newUser.save()
        } else {
            event.context.user = user
        }
        //context token
        event.context.token = token
    } catch (e: any) {
        console.log(e.message)
    }
}
