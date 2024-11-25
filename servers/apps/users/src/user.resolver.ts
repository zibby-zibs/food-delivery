import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ActivationResponse,
  ForgotPasswordResponse,
  LoginResponse,
  LogoutResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './types/user.types';
import {
  ActivationDto,
  ForgotDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
} from './dto/user.dto';
import { Response } from 'express';
import {
  BadRequestException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from './entities/user.entity';
import { AuthGuard } from './guards/auth.guard';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponse)
  async register(
    @Args('registerInput') registerDto: RegisterDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password)
      throw new BadRequestException('Please fill all the fields');

    const { activationToken } = await this.userService.register(
      registerDto,
      context.res,
    );
    const activation_token = activationToken.token;

    return { activation_token };
  }

  @Mutation(() => ActivationResponse)
  async activateUser(
    @Args('activationInput') activationDto: ActivationDto,
  ): Promise<ActivationResponse> {
    const user = await this.userService.activateUser(activationDto);

    return { user };
  }

  @Mutation(() => LoginResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    console.log({ email });
    const user = await this.userService.login({ email, password });

    // console.log({ user });
    return user;
  }

  @Query(() => LoginResponse)
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Context() context): Promise<LoginResponse> {
    const user = context.req.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const accessToken = context.req.headers.accesstoken;
    const refreshToken = context.req.headers.refreshtoken;

    // console.log({ user, accessToken, refreshToken });

    if (!accessToken) {
      throw new Error('Access token is missing');
    }

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => LogoutResponse)
  async logoutUser(@Context() context: { req: any }) {
    const request = context.req;
    request.user = null;
    request.headers.accesstoken = null;
    request.headers.refreshtoken = null;

    return { message: 'Logged out on all devices' };
  }

  @Mutation(() => ForgotPasswordResponse)
  async forgotPasswordToken(
    @Args('forgotPassword') forgotPassword: ForgotDto,
    @Context() context: { req: any },
  ): Promise<ForgotPasswordResponse> {
    const message = await this.userService.forgotPassword(forgotPassword);

    return message;
  }

  @Mutation(() => ResetPasswordResponse)
  async resetPassword(
    @Args('resetPassword') resetPassword: ResetPasswordDto,
    @Context() context: { req: any },
  ): Promise<ResetPasswordResponse> {
    const res = await this.userService.resetPassword(resetPassword);

    return res;
  }

  @Query(() => [User])
  async getUsers() {
    const user = await this.userService.getUsers();

    return { user };
  }
}
