import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { Response } from 'express';
import { PrismaService } from './prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { EmailService } from './email/email.service';
import { TokenSender } from './utils/sendToken';

interface UserData {
  name: string;
  email: string;
  phone_number: number;
  password: string;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    const existingPhone = await this.prisma.user.findUnique({
      where: {
        phone_number,
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');
    if (existingPhone) throw new BadRequestException('User Phone exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your Tasty Account',
      name,
      template: './activate-mail',
      activationCode,
    });

    return { activationToken, response };
  }

  // create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(100 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '3600m',
      },
    );

    return { token, activationCode };
  }

  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationCode, activationToken } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) throw new BadRequestException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        phone_number,
        password,
      },
    });

    return { user, response };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid credentials',
        },
      };

    const comparePassword = await bcrypt.compare(password, user.password);
    console.log({ password, userPass: user.password, comparePassword });

    if (!comparePassword)
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid credentials',
        },
      };

    const tokenSender = new TokenSender(this.jwtService, this.configService);
    return tokenSender.sendToken(user);
  }

  async getUsers() {
    const users = await this.prisma.user.findMany();

    return users;
  }
}
