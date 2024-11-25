import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Phone Number is required' })
  phone_number: number;

  //   @Field()
  //   @IsNotEmpty({ message: 'Password is required' })
  //   address: string;
}

@InputType()
export class LoginDto {
  @Field()
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

@InputType()
export class ActivationDto {
  @Field()
  @IsNotEmpty({ message: 'ActivationToken is required' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'ActivationCode is required' })
  activationCode: string;
}

@InputType()
export class ForgotDto {
  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}

@InputType()
export class ResetPasswordDto {
  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'ActivationCode is required' })
  activationToken: string;
}
