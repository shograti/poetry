"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const argon = require("argon2");
const library_1 = require("@prisma/client/runtime/library");
let AuthService = class AuthService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async signUp(dto) {
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
        }
        catch (error) {
            if (error instanceof library_1.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    if (error.meta.target.includes('email')) {
                        throw new common_1.ForbiddenException('Email already taken');
                    }
                    if (error.meta.target.includes('username')) {
                        throw new common_1.ForbiddenException('Username already taken');
                    }
                }
            }
            throw error;
        }
    }
    async signIn(dto) {
        const { email, username, password } = dto;
        let user;
        if (email) {
            user = await this.prisma.user.findUnique({
                where: {
                    email,
                },
            });
        }
        else if (username) {
            user = await this.prisma.user.findUnique({
                where: {
                    username,
                },
            });
        }
        if (!user) {
            throw new common_1.ForbiddenException('Invalid credentials');
        }
        const valid = await argon.verify(user.password, password);
        if (!valid) {
            throw new common_1.ForbiddenException('Invalid credentials');
        }
        delete user.password;
        return user;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map