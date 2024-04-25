import { PrismaService } from 'src/prisma/prisma.service';
import { SignUpDto } from './dto';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private prisma;
    private jwt;
    private config;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    signUp(dto: SignUpDto): Promise<{
        id: number;
        email: string;
        username: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    signIn(dto: SignInDto): Promise<{
        access_token: string;
    }>;
    signToken(userId: number, email: string): Promise<{
        access_token: string;
    }>;
}
