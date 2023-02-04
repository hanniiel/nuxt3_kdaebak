import { defineEventHandler, createError, getRouterParams } from 'h3'

export default defineEventHandler((event) => {
    const params = getRouterParams(event)
    return params
})
