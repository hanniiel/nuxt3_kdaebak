import { Query } from 'express-serve-static-core'

export default interface IRequestQuery<T> extends Express.Request {
    query: T
}
