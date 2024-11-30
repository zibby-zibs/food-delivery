import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

export class TokenSender {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  public sendToken(user: User) {
    const accessToken = this.jwt.sign(
      {
        id: user.id,
        type: user.role,
      },
      {
        secret: this.config.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    const refreshToken = this.jwt.sign(
      {
        id: user.id,
        type: user.role,
      },
      {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '14d',
      },
    );

    return { user, accessToken, refreshToken };
  }
}
