import { defineEventHandler, createError, readBody } from 'h3'
import validateAuth from '~~/server/validators/auth'
import { Group } from '~~/server/models/group'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)
    try {
        if (user.role != 'admin') {
            return createError({ message: 'not authorized' })
        }

        const body = await readBody(event)
        let id = body._id

        delete body._id
        delete body.members
        delete body.exmembers
        delete body.subgroups
        console.log(body)

        const group = await Group.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        })
        //update data
        if (!group) {
            return createError({ message: 'group not found' })
        }
        return group
    } catch (e: any) {
        return createError({ message: e.message })
    }
})
