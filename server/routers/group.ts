import { Router } from 'express'
import moment from 'moment'
import IRequestPagination from '~~/interfaces/requests/IRequestPagination'
import { Group } from '../models/group'
import authFire from '../middleware/authFire'
import IRequestPaginationRank from '~~/interfaces/requests/IRequestPaginationRank'

const router = Router()
router
    .route('/group')
    .get(async (req: IRequestPagination, res) => {
        let { id, page, per_page, name } = req.query
        // pagination
        page = page ?? 0
        per_page = per_page ?? 20

        // pagination
        try {
            if (id) {
                let group = await Group.findById(id)
                    .populate('members.member')
                    .populate('exmembers.member')
                    .populate('subgroups')
                    .exec()
                res.send(group)
            } else if (name) {
                let groups = await Group.find(
                    {
                        $or: [
                            {
                                name: {
                                    $regex: name,
                                    $options: 'i',
                                },
                            },
                            {
                                hangul: {
                                    $regex: name,
                                    $options: 'i',
                                },
                            },
                        ],
                    },
                    {},
                    {
                        skip: page * per_page,
                        limit: per_page,
                    }
                )
                    .populate('members.member')
                    .populate('exmembers.member')
                    .populate('subgroups')
                    .exec()
                if (groups.length === 0) {
                    return res.status(404).send('coincidence not found')
                }
                res.send(groups)
            } else {
                var groups = await Group.find(
                    {},
                    {},
                    {
                        skip: page * per_page,
                        limit: per_page,
                    }
                )
                    .populate('members.member')
                    .populate('exmembers.member')
                    .populate('subgroups')
                    .exec()
                res.send(groups)
            }
        } catch (e) {
            res.status(400).send({ error: e })
        }
    })
    .post(
        authFire,
        async (req, res) => {
            try {
                if (req.user.role != 'admin') {
                    return res.status(401).send({ error: 'not authorized' })
                }
                console.log(req.body)
                let group = new Group(req.body)
                let result = await group.save()

                res.send(result)
            } catch (e) {
                res.status(400).send({ error: e.message })
            }
        },
        (error, req, res, next) => {
            res.status(400).send({ error: error.message })
        }
    )
    .patch(authFire, async (req, res) => {
        try {
            if (req.user.role != 'admin') {
                return res.status(401).send({ error: 'not authorized' })
            }
            console.log(req.body)
            let id = req.body._id

            delete req.body._id
            delete req.body.members
            delete req.body.exmembers
            delete req.body.subgroups
            console.log(req.body)

            let group = await Group.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            })
            console.log('fff')
            //update data
            if (!group) {
                return res.status(400).send({ error: 'group not found' })
            }
            res.send(group)
        } catch (e) {
            res.status(400).send({ error: e })
        }
    })
    .delete(authFire, async (req, res) => {
        try {
            if (req.user.role != 'admin') {
                return res.status(401).send({ error: 'not authorized' })
            }
            let id = req.query.id
            if (!id) {
                return res.status(400).send('id not provided')
            }
            let result = await Group.deleteOne({ _id: id })
            if (result.deletedCount > 0) {
                return res.send('nice')
            } else {
                res.status(400).send('no item deleted')
            }
        } catch (error) {
            console.log(error.message)
            res.status(400).send('sww')
        }
    })

router.get('/group/ranking', async (req: IRequestPaginationRank, res) => {
    // pagination query params
    let { page, per_page, range, gender } = req.query
    page = page ?? 0
    per_page = per_page ?? 20

    //rank query params
    range = range ?? 'daily'
    gender = gender ?? 'F'

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
            default:
                start = moment().utc(false).startOf('day').toDate()
                end = moment().utc(false).endOf('day').toDate()
                break
        }

        //
        let groups = await Group.aggregate([
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
        res.send(groups)
    } catch (error) {
        res.status(400).send({ error })
    }
})

export default router
