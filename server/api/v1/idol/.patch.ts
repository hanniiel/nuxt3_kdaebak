import { defineEventHandler, createError, readBody, sendNoContent } from 'h3'
import validateAuth from '~~/server/validators/auth'
import { Idol } from '~~/server/models/idol'

export default defineEventHandler(async (event) => {
    const user = validateAuth(event)

    try {
        /*let updates = Object.keys(req.body);
        let allowed = ['profession','_id','name','hangul','avatar','birthday','debut'];
        let isValid = updates.every((key)=>allowed.includes(key));
        if(!isValid){
             return res.status(400).send("update operation not allowed");
        }*/
        if (user.role != 'admin') {
            return createError({ message: 'not authorized' })
        }
        const body = await readBody(event)
        let id = body._id

        let idol = await Idol.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        })
        if (!idol) {
            return sendNoContent(event)
        }
        return idol
    } catch (error: any) {
        return createError('Error update idol')
    }
})
