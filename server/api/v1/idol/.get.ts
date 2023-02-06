import { defineEventHandler, createError } from 'h3'
import IPagination from '~~/server/interfaces/IPagination'
import { Idol } from '~~/server/models/idol'
import { MongooseError } from 'mongoose'

export default defineEventHandler(async (event) => {
    const query = getQuery(event) as IPagination

    //pagination
    const page = query.page ? parseInt(query.page) : 0
    const per_page = query.per_page ? parseInt(query.per_page) : 20
    const { id, name } = query

    try {
        if (id) {
            const idol = await Idol.findById(id).populate('group').exec()
            return idol
        } else if (name) {
            const idols = await Idol.find(
                {
                    $or: [
                        { name: { $regex: name, $options: 'i' } },
                        { hangul: { $regex: name, $options: 'i' } },
                    ],
                },
                {},
                {
                    skip: page * per_page,
                    limit: per_page,
                }
            )
                .populate('group')
                .exec()

            if (idols.length === 0) {
                return createError({ message: 'coincidence not found' })
            }
            return idols
        } else {
            const idols = await Idol.find(
                {},
                {},
                {
                    skip: page * per_page,
                    limit: per_page,
                }
            )
                .populate('group')
                .exec()

            return idols
        }
    } catch (e: any) {
        return createError({ message: e.message, status: 501 })
    }
})
