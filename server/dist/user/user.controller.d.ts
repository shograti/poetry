import { User } from '@prisma/client';
export declare class UserController {
    getMe(user: User): {
        id: number;
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
