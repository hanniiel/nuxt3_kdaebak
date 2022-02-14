import { User } from '~~/server/models/user'

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}
