import mongoose from 'mongoose'
const { Schema, model } = mongoose

import IIdol from '~~/interfaces/IIdol'
import { Group } from './group'

const schema = new Schema<IIdol>(
    {
        name: {
            type: String,
            required: true,
        },
        hangul: {
            type: String,
            required: true,
        },
        fandom: String,
        nativeName: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        profession: {
            type: [String],
            enum: ['I', 'A', 'S'], //Idol, Actor,Singer
            required: true,
            //validate repeated value
        }, //Idol actor or array
        birthday: {
            type: Date,
            required: true,
        },
        debut: Date,
        active: {
            type: Boolean,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        id: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
)

schema.virtual('group', {
    ref: Group,
    localField: '_id',
    foreignField: 'members.member',
    justOne: true,
})

//discography
//fandom
const Idol = model<IIdol>('Idol', schema)

export { Idol }
