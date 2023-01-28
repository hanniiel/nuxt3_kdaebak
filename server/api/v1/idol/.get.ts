import { defineEventHandler } from 'h3'
import { Idol } from '~~/server/models/idol'
import connect from '../../../../server/connection'

connect()
export default defineEventHandler(async (event) => {
    let idols = await Idol.find({}, {}, { skip: 0 * 10, limit: 20 }).exec()
    return idols
})
