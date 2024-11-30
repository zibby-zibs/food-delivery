import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { RestaurantsService } from './restaurants.service';
import {
  CreateMenuItemInput,
  MenuItem,
  MenuItemCategory,
  Restaurant,
  RestaurantLoginResponse,
  RestaurantRegisterResponse,
} from './entities/restaurant.entity';
import { BadRequestException } from '@nestjs/common';

import {
  RestaurantActivationDto,
  RestaurantActivationResponse,
  RestaurantLoginDto,
  RestaurantRegisterDto,
} from './dto/register.dto';
import { Roles } from 'apps/lib/decorators/roles.decorator';

@Resolver(() => Restaurant)
export class RestaurantsResolver {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Mutation(() => RestaurantRegisterResponse, { name: 'RegisterResponse' })
  async registerRestaurant(
    @Args('restaurantRegisterInput') registerDto: RestaurantRegisterDto,
    @Context() context: { res: Response },
  ): Promise<RestaurantRegisterResponse> {
    if (!registerDto.name || !registerDto.email || !registerDto.password)
      throw new BadRequestException('Please fill all the fields');

    const { activationToken } = await this.restaurantsService.register(
      registerDto,
      context.res,
    );
    const activation_token = activationToken.token;

    return { activation_token };
  }

  @Mutation(() => RestaurantActivationResponse, { name: 'activateRestaurant' })
  async activateRestaurant(
    @Args('restaurantActivationInput') activationRDto: RestaurantActivationDto,
  ): Promise<RestaurantActivationResponse> {
    const user =
      await this.restaurantsService.activateRestaurant(activationRDto);

    return user;
  }

  @Mutation(() => RestaurantLoginResponse, { name: 'RLoginResponse' })
  async loginRestaurant(
    @Args('RestaurantLoginDto') loginDto: RestaurantLoginDto,
  ): Promise<RestaurantLoginResponse> {
    const { email, password } = loginDto;

    const user = await this.restaurantsService.login({ email, password });

    // console.log({ user });
    return user;
  }

  @Mutation(() => MenuItem, { name: 'createMenuItem' })
  @Roles('restaurant')
  async createMenuItem(
    @Args('input') input: CreateMenuItemInput,
  ): Promise<MenuItem> {
    const items = await this.restaurantsService.createMenuItem(input);
    return items;
  }

  @Query(() => [MenuItemCategory], { nullable: true })
  @Roles('restaurant')
  async getRestaurantMenu(@Args('id') id: string) {
    const items = await this.restaurantsService.getMenuItems(id);

    // console.log(items);
    return items;
  }

  @Query(() => MenuItem, { nullable: true })
  @Roles('restaurant')
  async getMenuItem(@Args('id') id: string) {
    const items = await this.restaurantsService.getMenuItem(id);

    return items;
  }

  @Mutation(() => MenuItem, { nullable: true })
  @Roles('restaurant')
  async editMenuItem(
    @Args('id') id: string,
    @Args('input') input: CreateMenuItemInput,
  ) {
    const items = await this.restaurantsService.editMenuItem(id, input);

    return items;
  }

  @Mutation(() => MenuItem, { nullable: true })
  @Roles('restaurant')
  async deleteMenuItem(@Args('id') id: string) {
    const items = await this.restaurantsService.deleteMenuItem(id);

    return items;
  }
}
