import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Get,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenEntity, LoginEntity } from './entities/login.entity';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { UserEntity } from './entities/user.entity';
@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginEntity })
  async login(@Body() loginDto: LoginDto): Promise<LoginEntity> {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  @Version('1')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.authService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse()
  async logout(@Request() req: Request): Promise<void> {
    const token: string = req.headers['authorization'].split(' ')[1];
    return await this.authService.logout(token);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ type: AccessTokenEntity })
  async refreshAccessToken(
    @Body() { refreshToken }: RefreshAccessTokenDto,
  ): Promise<AccessTokenEntity> {
    return await this.authService.refreshAccessToken(refreshToken);
  }

  @Post('reset-password')
  @Version('1')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordDto);
  }
}
