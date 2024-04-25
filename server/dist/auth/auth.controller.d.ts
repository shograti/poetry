import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { SignInDto } from './dto/sign-in.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
}
