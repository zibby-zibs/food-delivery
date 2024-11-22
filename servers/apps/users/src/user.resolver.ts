import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  ActivationResponse,
  LoginResponse,
  RegisterResponse,
} from './types/user.types';
import { ActivationDto, LoginDto, RegisterDto } from './dto/user.dto';
import { Response } from 'express';
import { BadRequestException } from '@nestjs/common';
import { User } from './entities/user.entity';

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
    @Context() context: { res: Response },
  ): Promise<ActivationResponse> {
    const user = await this.userService.activateUser(
      activationDto,
      context.res,
    );

    return { user };
  }

  @Mutation(() => LoginResponse)
  async login(@Args('loginDto') loginDto: LoginDto): Promise<LoginResponse> {
    const { email, password } = loginDto;

    console.log({ email });
    const user = await this.userService.login({ email, password });

    console.log({ user });
    return user;
  }

  @Query(() => [User])
  async getUsers() {
    const user = await this.userService.getUsers();

    return { user };
  }
}
