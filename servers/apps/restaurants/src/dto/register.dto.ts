import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

import { RErrorType, Restaurant } from '../entities/restaurant.entity';
import { FoodCategory } from '@prisma/client';

@InputType()
export class RestaurantGeneralCategoryDto {
  @Field(() => String)
  @IsNotEmpty()
  type: FoodCategory;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}

@InputType()
export class RestaurantRegisterDto {
  @Field()
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Field()
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Phone Number is required' })
  phone: string;

  @Field()
  @IsNotEmpty({ message: 'Working Hours is required' })
  openHours: string;

  @Field()
  @IsOptional()
  description?: string;

  @Field()
  @IsOptional()
  website?: string;

  @Field(() => [RestaurantGeneralCategoryDto])
  @IsArray()
  categories: RestaurantGeneralCategoryDto[];
}

@InputType()
export class RestaurantLoginDto {
  @Field()
  @IsEmail({}, { message: 'Must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

@InputType()
export class RestaurantActivationDto {
  @Field()
  @IsNotEmpty({ message: 'ActivationToken is required' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'ActivationCode is required' })
  activationCode: string;
}

@ObjectType()
export class RestaurantActivationResponse {
  @Field(() => Restaurant)
  user?: Restaurant | any;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => RErrorType, { nullable: true })
  error?: RErrorType;
}

@InputType()
export class MenuCategoryDto {
  @Field()
  @IsNotEmpty()
  name: string;
}

@InputType()
export class CategoryDto {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field(() => FoodCategory)
  @IsNotEmpty()
  type: FoodCategory;

  @Field()
  @IsOptional()
  description?: string;
}
