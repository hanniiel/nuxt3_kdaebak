import connect from '../connection'
import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
    connect()
})
