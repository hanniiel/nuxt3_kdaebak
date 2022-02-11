import { IPagination } from './IRequestPagination'
import IRequestQuery from './IRequestQuery'

export default interface IRequestPaginationRank
    extends IRequestQuery<
        {
            profession?: string
            range?: string
            gender?: string
        } & IPagination
    > {}
