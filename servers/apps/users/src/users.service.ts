import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/user.dto';
import { Response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    // private readonly prisma,
    private readonly configService: ConfigService,
  ) {}
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password } = registerDto;

    const user = {
      name,
      email,
      password,
    };

    return user;
  }
}
