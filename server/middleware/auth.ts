import { defineEventHandler, getCookie } from 'h3'

export default defineEventHandler((event) => {
    const { req } = event.node
    if (!req.headers.authorization) {
        const cookie = getCookie(event, 'jwt')
        if (cookie) req.headers.authorization = `Bearer ${cookie}`
    } else {
        //todo check jwt
        //todo
    }
})
