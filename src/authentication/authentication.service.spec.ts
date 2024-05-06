import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockJwtService = () => ({
  sign: jest.fn(),
  verify: jest.fn(),
  signAsync: jest.fn(),
});
const mockPrismaService = () => ({
  user: {
    create: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
  },
});
const mockRedisService = () => ({
  blackListToken: jest.fn(),
});

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let prismaService;
  let jwtService;
  let redisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: JwtService, useFactory: mockJwtService },
        { provide: PrismaService, useFactory: mockPrismaService },
        { provide: RedisService, useFactory: mockRedisService },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
    redisService = module.get<RedisService>(RedisService);
  });
  describe('login', () => {
    it('should return an access token if login is successful', async () => {
      const loginDto = { email: 'test@example.com', password: 'rightPassword' };
      prismaService.user.findUniqueOrThrow.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
      });

      // Mock return values for jwtService.sign
      jwtService.sign
        .mockReturnValueOnce('accessToken123')
        .mockReturnValueOnce('refreshToken456');

      const result = await service.login(loginDto);
      expect(result.accessToken).toEqual('accessToken123');
      expect(result.refreshToken).toEqual('refreshToken456');
    });
  });
  // Tests (corrected as above)
});
