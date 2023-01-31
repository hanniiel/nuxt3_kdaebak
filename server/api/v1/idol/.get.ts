import { defineEventHandler, createError } from 'h3'
import { Idol } from '~~/server/models/idol'
import connect from '../../../../server/connection'

connect()
export default defineEventHandler(async (event) => {
    let { page, per_page, id, name } = getQuery(event)

    //pagination
    page = page ?? '0'
    per_page = per_page ?? '20'

    try {
        if (id) {
            const idol = await Idol.findById(id)
                //.populate('group')
                .exec()
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
                    skip:
                        parseInt(page as string) * parseInt(per_page as string),
                    limit: parseInt(per_page as string),
                }
            )

            if (idols.length === 0) {
                return createError({ message: 'coincidence not found' })
            }
            return idols
        } else {
            const idols = await Idol.find(
                {},
                {},
                {
                    skip:
                        parseInt(page as string) * parseInt(per_page as string),
                    limit: parseInt(per_page as string),
                }
            )
                //.populate('group')
                .exec()

            return idols
        }
    } catch (e) {
        throw createError({ message: 'fk', status: 501 })
    }
})
