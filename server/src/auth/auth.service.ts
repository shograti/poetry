import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signUp(dto: SignUpDto) {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username,
          password: hash,
        },
      });
      delete user.password;
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          if ((error.meta.target as string[]).includes('email')) {
            throw new ForbiddenException('Email already taken');
          }
          if ((error.meta.target as string[]).includes('username')) {
            throw new ForbiddenException('Username already taken');
          }
        }
      }
      throw error;
    }
  }

  async signIn(dto: SignInDto) {
    const { email, username, password } = dto;
    let user: any;
    if (email) {
      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } else if (username) {
      user = await this.prisma.user.findUnique({
        where: {
          username,
        },
      });
    }
    if (!user) {
      throw new ForbiddenException('Invalid credentials');
    }
    const valid = await argon.verify(user.password, password);
    if (!valid) {
      throw new ForbiddenException('Invalid credentials');
    }
    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '7d',
    });

    return {
      access_token: token,
    };
  }
}
