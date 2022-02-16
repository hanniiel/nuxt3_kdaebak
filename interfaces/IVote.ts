import { Types } from 'mongoose'

export default interface IVote {
    user: string
    idol: Types.ObjectId
    act: Types.ObjectId
    group: Types.ObjectId
    votes: number
}
