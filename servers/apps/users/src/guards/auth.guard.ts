import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context);
    const { req } = gqlContext.getContext();

    const accessToken = req.headers.accessToken?.split('Bearer ')[1] as string;
    // const refreshToken = req.headers.refreshtoken as string;
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());

    if (!accessToken) {
      throw new UnauthorizedException('Please login ');
    }

    if (roles?.length) {
      try {
        if (accessToken) {
          const decoded = this.jwtService.verify(accessToken, {
            secret: this.config.get('ACCESS_TOKEN_SECRET'),
          });

          const user = await this.prisma.user.findUnique({
            where: {
              id: decoded.id,
            },
          });

          if (!user) return false;

          if (roles?.includes(user.role)) return true;
        }

        return false;
      } catch (error) {
        console.log('AUTH_GUARD_ERROR', error);
        return false;
      }
    }

    return true;
  }

  private async updateAccessToken(req: any): Promise<void> {
    try {
      const refreshTokenData = req.headers.refreshtoken as string;
      const decoded = this.jwtService.verify(refreshTokenData, {
        secret: this.config.get('REFRESH_TOKEN_SECRET'),
      });
      if (!decoded) {
        throw new UnauthorizedException('Invalid access token');
      }

      const user = await this.prisma.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      const accessToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get('ACCESS_TOKEN_SECRET'),
          expiresIn: '15m',
        },
      );

      const refreshToken = this.jwtService.sign(
        { id: user.id },
        {
          secret: this.config.get('REFRESH_TOKEN_SECRET'),
          expiresIn: '7d',
        },
      );

      req.headers.accesstoken = accessToken;
      req.headers.refreshtoken = refreshToken;
      req.user = user;
    } catch (error) {
      console.log(error);
    }
  }
}
