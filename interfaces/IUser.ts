export default interface IUser {
    _id: string
    name?: string
    currency: number
    password: string
    role: string
    email: string
    tokens: string[]
}
