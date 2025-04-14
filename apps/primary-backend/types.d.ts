import { User  } from '@repo/types'
export {} 
declare global {
    namespace Express {
        interface Request {
            user: User;
        }
    }
}