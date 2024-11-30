import { ObjectType, Field, Float, InputType } from '@nestjs/graphql';
import { FoodCategory } from '@prisma/client';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@ObjectType()
export class RErrorType {
  @Field()
  message: string;

  @Field({ nullable: true })
  code?: string;
}

@ObjectType()
export class Restaurant {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  website?: string;

  // @Field()
  // password: string;

  @Field()
  phone: string;

  @Field()
  openHours: string;

  @Field({ nullable: true })
  address?: string;
}

@ObjectType()
export class RestaurantRegisterResponse {
  @Field()
  activation_token: string;

  @Field(() => RErrorType, { nullable: true })
  error?: RErrorType;
}

@ObjectType()
export class RestaurantLoginResponse {
  @Field(() => Restaurant)
  restaurant?: Restaurant;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => RErrorType, { nullable: true })
  error?: RErrorType;
}

@ObjectType()
export class RestaurantGeneralCategory {
  @Field(() => String)
  type: FoodCategory;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;
}

@ObjectType()
export class MenuItemCategory {
  @Field(() => String, { nullable: true })
  name: string;

  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  restaurantId: string;

  @Field({ nullable: true })
  restaurant: Restaurant;

  @Field(() => [MenuItem], { nullable: true })
  menuItems: MenuItem[];
}
@ObjectType()
export class MenuItem {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field({ nullable: true })
  imageUrl?: string;

  @Field()
  inStock: boolean;

  @Field(() => [MenuItemCategory])
  @IsArray()
  @IsOptional()
  categories?: MenuItemCategory[];
}

@InputType()
export class CreateMenuItemInput {
  @Field()
  @IsString()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @Field()
  @IsBoolean()
  inStock: boolean;

  @Field()
  @IsString()
  restaurantId: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  categoryNames: string[];
}

@ObjectType()
export class TokenDto {
  @Field()
  @IsNotEmpty({ message: 'Authorization is required' })
  accessToken: string;
}

@ObjectType()
export class MenuItemResponse {
  @Field(() => MenuItem)
  menuItem?: MenuItem;

  @Field()
  error?: RErrorType;
}
