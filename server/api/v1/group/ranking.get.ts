import { defineEventHandler, createError, getQuery } from 'h3'
import { Group } from '~~/server/models/group'
import moment from 'moment'
import IRankingPagination from '~~/server/interfaces/IRankingPagination'

export default defineEventHandler(async (event) => {
    const query = getQuery(event) as IRankingPagination

    const page = parseInt(query.page ?? 0)
    const per_page = parseInt(query.per_page ?? 20)
    const range = query.range ?? 'daily'
    const gender = query.gender ?? 'F'

    try {
        let start, end

        switch (range) {
            case 'daily':
                start = moment().utc(false).startOf('day').toDate()
                end = moment().utc(false).endOf('day').toDate()
                break
            case 'weekly':
                start = moment().utc(false).startOf('isoWeek').toDate()
                end = moment().utc(false).endOf('isoWeek').toDate()
                break
            case 'monthly':
                start = moment().utc(false).startOf('month').toDate()
                end = moment().utc(false).endOf('month').toDate()
                break
            case 'alltime':
                start = moment().subtract(50, 'years').utc(false).toDate()
                end = moment().utc(false).endOf('day').toDate()
                break
            default:
                start = moment().utc(false).startOf('day').toDate()
                end = moment().utc(false).endOf('day').toDate()
                break
        }

        //
        const groups = await Group.aggregate([
            {
                $match: {
                    gender: { $regex: gender, $options: 'i' },
                },
            },
            {
                $lookup: {
                    from: 'votes',
                    let: { id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                createdAt: { $gte: start, $lte: end },
                                $expr: {
                                    $eq: ['$group', '$$id'],
                                },
                            },
                        },
                    ],
                    as: 'idol_docs',
                },
            },
            {
                $unwind: {
                    path: '$idol_docs',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    members: { $first: '$members' },
                    name: { $first: '$name' },
                    hangul: { $first: '$hangul' },
                    gender: { $first: '$gender' },
                    debut: { $first: '$debut' },
                    active: { $first: '$active' },
                    avatar: { $first: '$avatar' },
                    logo: { $first: '$logo' },
                    votes: { $sum: '$idol_docs.votes' },
                },
            },
            { $sort: { votes: -1, name: 1 } },
            { $skip: page * per_page },
            { $limit: per_page },
        ]).exec()
        return groups
    } catch (error) {
        return createError('Group error')
    }
})
