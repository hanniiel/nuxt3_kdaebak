import mongoose from 'mongoose'
import IVote from '~~/interfaces/IVote'
const { Schema, model } = mongoose

const schema = new Schema<IVote>(
    {
        user: {
            type: String,
            required: true,
            ref: 'User',
        },
        idol: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Idol',
        },
        act: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Idol',
        },
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
        },
        votes: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)
const Vote = model<IVote>('Vote', schema)

export { Vote }
