import { User } from '~~/server/models/user'
declare module 'h3' {
    interface H3EventContext {
        user?: User
        token?: string
    }
}
