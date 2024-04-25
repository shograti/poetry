import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service';
import * as pactum from 'pactum';
import { SignUpDto } from 'src/auth/dto';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

describe('App E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    describe('Sign up', () => {
      it('Should sign up', async () => {
        const dto: SignUpDto = {
          email: 'test@test.fr',
          username: 'test',
          password: 'test',
        };
        return pactum
          .spec()
          .post('/auth/sign-up')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Sign in', () => {
      it('Should sign in with email and password', async () => {
        const dto: SignInDto = {
          email: 'test@test.fr',
          password: 'test',
        };
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody(dto)
          .expectStatus(200);
      });
      it('Should sign in with username and password', async () => {
        const dto: SignInDto = {
          username: 'test',
          password: 'test',
        };
        return pactum
          .spec()
          .post('/auth/sign-in')
          .withBody(dto)
          .expectStatus(200);
      });
    });
  });
  /*   describe('User', () => {});
  describe('Vote', () => {});
  describe('Verse', () => {});
  describe('EditedVerse', () => {}); */
});
