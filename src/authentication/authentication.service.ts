import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { LoginDto } from './dto/login.dto';
import { LoginEntity, AccessTokenEntity } from './entities/login.entity';
const numberOfHashingRounds = 10;

@Injectable()
export class AuthenticationService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      numberOfHashingRounds,
    );

    await this.prismaService.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
      },
    });
  }

  async login(loginDto: LoginDto): Promise<LoginEntity> {
    const email = loginDto.email;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('No user found with the given email');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    return {
      accessToken: this.jwtService.sign({ userId: user.id }),
      refreshToken: this.jwtService.sign(
        { userId: user.id },
        { expiresIn: '7d' },
      ),
    };
  }

  async logout(token: string): Promise<void> {
    await this.redisService.blackListToken(token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(
      resetPasswordDto.password,
      numberOfHashingRounds,
    );

    await this.prismaService.user.update({
      where: { email: resetPasswordDto.email },
      data: {
        password: hashedPassword,
      },
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<AccessTokenEntity> {
    const { userId } = this.jwtService.verify(refreshToken);
    const newAccessToken: string = this.jwtService.sign(
      { userId },
      { expiresIn: '15m' },
    );
    return { accessToken: newAccessToken };
  }
  catch(error: Error) {
    throw new UnauthorizedException('Failed to refresh access token');
  }
}
