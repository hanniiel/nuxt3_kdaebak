import { Schema } from 'mongoose'

export default interface IVote {
    user: string
    idol: Schema.Types.ObjectId
    act: Schema.Types.ObjectId
    group: Schema.Types.ObjectId
    votes: number
}
