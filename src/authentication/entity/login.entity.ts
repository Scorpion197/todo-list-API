import { ApiProperty } from '@nestjs/swagger';

export class LoginEntity {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}

export class AccessTokenEntity {
  @ApiProperty()
  accessToken: string;
}
