import mongoose from 'mongoose'
const { Schema, model } = mongoose
import IGroup from '~~/interfaces/IGroup'
import { Idol } from './idol'

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
                    refPath: './idol.ts',
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
                    refPath: './idol.ts',
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

const Group = mongoose.model<IGroup>('Group', schema)

export { Group, schema }
