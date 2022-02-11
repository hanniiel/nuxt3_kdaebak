import { Request, Router } from 'express'

import { Idol } from '../models/idol'
import auth from '../middleware/authFire'

const router = Router()

import moment from 'moment'
import IRequestPagination from '~~/interfaces/requests/IRequestPagination'
import IRequestPaginationRank from '~~/interfaces/requests/IRequestPaginationRank'

router
    .route('/idol')
    .get(async (req: IRequestPagination, res) => {
        let { id, page, per_page, name } = req.query
        //pagination

        page = page ?? 0
        per_page = per_page ?? 20
        //
        try {
            if (id) {
                let idol = await Idol.findById(id).populate('group').exec()
                res.status(200).send(idol)
            } else if (name) {
                let name = req.query.name

                let idols = await Idol.find(
                    {
                        $or: [
                            { name: { $regex: name, $options: 'i' } },
                            { hangul: { $regex: name, $options: 'i' } },
                        ],
                    },
                    {},
                    { skip: page * per_page, limit: per_page }
                )
                if (idols.length === 0) {
                    return res.status(400).send('coincidence not found')
                }
                res.send(idols)
            } else {
                let idols = await Idol.find(
                    {},
                    {},
                    { skip: page * per_page, limit: per_page }
                )
                    .populate('group')
                    .exec()
                res.status(200).send(idols)
            }
        } catch (e) {
            res.status(400).send({ error: e })
        }
    })
    .post(auth, async (req, res) => {
        try {
            if (req.user.role != 'admin') {
                return res.status(401).send({ error: 'not authorized' })
            }
            console.log('ddd')
            let idol = new Idol({
                ...req.body,
            })

            let result = await idol.save()
            res.send(result)
        } catch (error) {
            res.status(400).send({ error })
        }
    })
    .patch(auth, async (req, res) => {
        try {
            /*let updates = Object.keys(req.body);
        let allowed = ['profession','_id','name','hangul','avatar','birthday','debut'];
        let isValid = updates.every((key)=>allowed.includes(key));
        if(!isValid){
             return res.status(400).send("update operation not allowed");
        }*/
            if (req.user.role != 'admin') {
                return res.status(401).send({ error: 'not authorized' })
            }
            let id = req.body._id

            console.log(req.body)

            let idol = await Idol.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            })
            if (!idol) {
                res.status(400).send('not idol found')
            }
            res.send(idol)
        } catch (error) {
            console.log(error.message)
            res.status(400).send('tfuk')
        }
    })
    .delete(auth, async (req, res) => {
        try {
            if (req.user.role != 'admin') {
                return res.status(401).send({ error: 'not authorized' })
            }
            let id = req.query.id
            if (!id) {
                return res.status(400).send('id not provided')
            }
            let result = await Idol.deleteOne({ _id: id })
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

router.get('/idol/ranking', async (req: IRequestPaginationRank, res) => {
    let { page, per_page, range, gender, profession } = req.query

    page = page ?? 0
    per_page = per_page ?? 20
    range = range ?? 'daily'
    gender = gender ?? 'F'
    profession = profession?.toLowerCase() ?? 'I'

    let voteIdentity = profession.toLowerCase() === 'i' ? '$idol' : '$act'

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

        //
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
                    profession: { $first: '$profession' },
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
        res.send(idols)
    } catch (e) {
        res.status(400).send({ error: e })
    }
})

export default router
