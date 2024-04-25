import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto';
import { SignInDto } from './dto/sign-in.dto';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    signUp(dto: SignUpDto): Promise<{
        id: number;
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    signIn(dto: SignInDto): Promise<any>;
}
