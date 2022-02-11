import IRequestQuery from './IRequestQuery'

export interface IPagination {
    id?: string
    page?: number
    per_page?: number
    name?: string
}

export default interface IRequestPagination
    extends IRequestQuery<IPagination> {}
