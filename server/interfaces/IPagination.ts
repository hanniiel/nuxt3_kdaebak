import { QueryObject } from 'ufo'
export default interface IPagination extends QueryObject {
    id: string
    name: string
    page: string
    per_page: string
}
