import {
    defineEventHandler,
    getQuery,
    NodeEventContext,
    H3Event,
    createError,
} from 'h3'
import { Group } from '~~/server/models/group'
import IPagination from '~~/server/interfaces/IPagination'

export default defineEventHandler(async (event) => {
    const query = getQuery(event) as IPagination

    const page = query.page ? parseInt(query.page) : 0
    const per_page = query.per_page ? parseInt(query.per_page) : 20
    const { id, name } = query

    try {
        if (id) {
            let group = await Group.findById(id)
                .populate('members.member')
                .populate('exmembers.member')
                .populate('subgroups')
                .exec()
            return group
        } else if (name) {
            let groups = await Group.find({
                $or: [
                    { name: { $regex: name, $options: 'i' } },
                    { hangul: { $regex: name, $options: 'i' } },
                ],
            })
            if (groups.length === 0) {
                return createError('coincidence not found')
            }
            return groups
        } else {
            var groups = await Group.find(
                {},
                {},
                { skip: page * per_page, limit: per_page }
            )
                .populate('members.member')
                .populate('exmembers.member')
                .populate('subgroups')
                .exec()
            return groups
        }
    } catch (e: any) {
        return createError('Error with groups ' + e.message)
    }
})
