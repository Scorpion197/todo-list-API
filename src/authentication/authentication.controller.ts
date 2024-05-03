import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
  Get,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginDto } from './dto/login.dto';
import { AccessTokenEntity, LoginEntity } from './entities/login.entity';
import { RefreshAccessTokenDto } from './dto/refreshAccessToken.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
@Controller('authentication')
@ApiTags('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginEntity })
  async login(@Body() loginDto: LoginDto): Promise<LoginEntity> {
    return await this.authService.login(loginDto);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() createUserDto: CreateUserDto): Promise<void> {
    return await this.authService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: Request): Promise<void> {
    const token: string = req.headers['authorization'].split(' ')[1];
    return await this.authService.logout(token);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: AccessTokenEntity })
  async refreshAccessToken(
    @Body() { refreshToken }: RefreshAccessTokenDto,
  ): Promise<AccessTokenEntity> {
    return await this.authService.refreshAccessToken(refreshToken);
  }
}
