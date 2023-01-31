import { createError, defineEventHandler } from 'h3'
import moment from 'moment'
import { Idol } from '~~/server/models/idol'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    let page = parseInt((query.page as string) ?? 0)
    let per_page = parseInt((query.per_page as string) ?? 20)
    let range = (query.range as string) ?? 'daily'
    let gender = (query.gender as string) ?? 'F'
    let profession = (query.profession as string) ?? 'I'
    let voteIdentity = profession.toLocaleLowerCase() === 'i' ? '$idol' : '$act'

    try {
        let start, end

        switch (range) {
            case 'daily':
                start = moment().utc(false).startOf('day').toDate()
                end = moment().utc(false).endOf('day').toDate()
                break
            case 'weekly':
                start = moment().utc(true).startOf('isoWeek').toDate()
                end = moment().utc(true).endOf('isoWeek').toDate()
                break
            case 'monthly':
                start = moment().utc(false).startOf('month').toDate()
                end = moment().utc(false).endOf('month').toDate()
                break
            default:
                start = moment().utc(false).startOf('day').toDate()
                end = moment().utc(false).endOf('day').toDate()
                break
        }
        let idols = await Idol.aggregate([
            {
                $match: {
                    gender: { $regex: gender, $options: 'i' },
                    profession: { $regex: profession, $options: 'i' },
                },
            },
            {
                $lookup: {
                    from: 'votes',
                    let: { idol: '$_id' }, //local fields
                    pipeline: [
                        {
                            $match: {
                                createdAt: { $gte: start, $lte: end },
                                $expr: {
                                    $eq: [voteIdentity, '$$idol'],
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
                    name: { $first: '$name' },
                    hangul: { $first: '$hangul' },
                    gender: { $first: '$gender' },
                    birthday: { $first: '$birthday' },
                    debut: { $first: '$debut' },
                    active: { $first: '$active' },
                    avatar: { $first: '$avatar' },
                    votes: { $sum: '$idol_docs.votes' },
                },
            },
            { $sort: { votes: -1, name: 1 } },
            { $skip: page * per_page },
            { $limit: per_page },
        ]).exec()
        return idols
    } catch (e) {
        throw createError('error with ranking')
    }
})
