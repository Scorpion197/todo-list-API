import { ApiProperty } from '@nestjs/swagger';
export class AccessTokenEntity {
  @ApiProperty()
  accessToken: string;
}

export class LoginEntity extends AccessTokenEntity {
  @ApiProperty()
  refreshToken: string;
}
