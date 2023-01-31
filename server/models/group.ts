import mongoose from 'mongoose'
const { Schema, model } = mongoose

import IGroup from '~~/interfaces/IGroup'

const schema = new Schema<IGroup>(
    {
        name: {
            type: String,
            required: true,
        },
        hangul: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            required: true,
        },
        fandom: String,
        debut: {
            type: Date,
            required: true,
        },
        state: {
            type: String,
            enum: ['A', 'H', 'D'],
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        members: [
            {
                member: {
                    type: Schema.Types.ObjectId,
                    required: false,
                    unique: false,
                    ref: 'Idol',
                },
                joined: Date,
            },
        ],
        exmembers: [
            {
                member: {
                    type: Schema.Types.ObjectId,
                    required: false,
                    unique: false,
                    ref: 'Idol',
                },
                left: Date,
                reason: String,
            },
        ],
        subgroups: [
            {
                type: Schema.Types.ObjectId,
                required: false,
                ref: 'Group',
            },
        ],
    },
    { timestamps: true }
)

const Group = model<IGroup>('Group', schema)

export { Group, schema }
