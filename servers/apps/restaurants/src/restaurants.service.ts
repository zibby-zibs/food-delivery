import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'apps/users/src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { EmailService } from 'apps/users/src/email/email.service';
import {
  RestaurantActivationDto,
  RestaurantLoginDto,
  RestaurantRegisterDto,
} from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { FoodCategory, Restaurant } from '@prisma/client';
import { CreateMenuItemInput } from './entities/restaurant.entity';

interface RestaurantGeneralCategory {
  type: FoodCategory;
  description?: string;
}
interface UserData {
  name: string;
  email: string;
  password: string;
  phone: string;
  description: string;
  openHours: string;
  website: string;
  address: string;
  categories: RestaurantGeneralCategory[];
}
@Injectable()
export class RestaurantsService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RestaurantRegisterDto, response: Response) {
    const {
      name,
      email,
      password,
      phone,
      description,
      openHours,
      website,
      address,
      categories,
    } = registerDto;

    const existingUser = await this.prisma.restaurant.findUnique({
      where: {
        email,
      },
    });
    const existingPhone = await this.prisma.restaurant.findUnique({
      where: {
        phone,
      },
    });

    if (existingUser) throw new BadRequestException('User already exists');
    if (existingPhone) throw new BadRequestException('User Phone exists');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone,
      description,
      openHours,
      website,
      address,
      categories,
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your Tasty Restaurant Account',
      name,
      template: './activate-mail',
      activationCode,
    });

    return { activationToken, response };
  }

  private async createActivationToken(user: UserData) {
    const activationCode = Math.floor(100 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '30m',
      },
    );

    return { token, activationCode };
  }

  async activateRestaurant(activationDto: RestaurantActivationDto) {
    const { activationCode, activationToken } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const {
      name,
      email,
      password,
      phone,
      description,
      website,
      address,
      categories,
    } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) throw new BadRequestException('User already exists');

    const user = await this.prisma.restaurant.create({
      data: {
        name,
        email,
        password,
        phone,
        description,
        website,
        address,
        categories: {
          create: categories.map((category) => ({
            type: category.type,
          })),
        },
      },
      include: {
        categories: true,
      },
    });

    console.log({ user });

    const userResponse = this.signToken(user);

    return userResponse;
  }

  async login(loginDto: RestaurantLoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.restaurant.findUnique({
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

    if (!comparePassword)
      return {
        user: null,
        accessToken: null,
        refreshToken: null,
        error: {
          message: 'Invalid credentials',
        },
      };

    const tokenSender = this.signToken(user);
    return tokenSender;
  }

  private async signToken(user: Restaurant) {
    const accessToken = this.jwtService.sign(
      {
        id: user.id,
        type: user.role,
      },
      {
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
        expiresIn: '7d',
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        id: user.id,
        type: user.role,
      },
      {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
        expiresIn: '14d',
      },
    );

    return { user, accessToken, refreshToken };
  }

  async createMenuItem(input: CreateMenuItemInput) {
    return this.prisma.$transaction(async (prisma) => {
      // Create the menu item
      const menuItem = await prisma.menuItem.create({
        data: {
          name: input.name,
          description: input.description,
          price: input.price,
          imageUrl: input.imageUrl,
          inStock: input.inStock,
          restaurantId: input.restaurantId,
        },
      });

      // Find or create categories and link them
      await Promise.all(
        input.categoryNames.map(async (categoryName) => {
          // Find or create category
          let category = await prisma.menuItemCategory.findFirst({
            where: {
              name: categoryName,
              restaurantId: input.restaurantId,
            },
          });

          // Create MenuItemCategory
          // return prisma.menuItemCategory.create({
          //   data: {
          //     restaurantId: input.restaurantId,
          //     name: category ? category.name : categoryName,
          //   },
          // });
          if (!category) {
            category = await prisma.menuItemCategory.create({
              data: {
                name: categoryName,
                restaurantId: input.restaurantId,
              },
            });
          }

          // Create junction model entry
          return prisma.menuItemToMenuItemCategory.create({
            data: {
              menuItemId: menuItem.id,
              menuItemCategoryId: category.id,
            },
          });
        }),
      );

      console.log({ menuItem });

      return menuItem;
    });
  }

  async getMenuItems(id: string) {
    const items = await this.prisma.menuItemCategory.findMany({
      where: {
        restaurantId: id,
      },
      include: {
        menuItems: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return items.map((category) => ({
      ...category,
      menuItems: category.menuItems.map((item) => item.menuItem),
    }));
  }

  async getMenuItem(id: string) {
    const item = await this.prisma.menuItem.findUnique({
      where: {
        id,
      },
      include: {
        categories: {
          select: {
            menuItemCategory: true,
          },
        },
      },
    });

    return {
      ...item,
      categories: item.categories.map((category) => category.menuItemCategory),
    };
  }

  async editMenuItem(id: string, input: CreateMenuItemInput) {
    const currentMenu = await this.getMenuItem(id);

    if (!currentMenu) {
      throw new BadRequestException('Menu item not found');
    }

    const previousCategories = currentMenu.categories;

    const isIncluded = (categoryName: string) => {
      return previousCategories.some(
        (category) => category.name === categoryName,
      );
    };

    const newCategories = input.categoryNames.filter(
      (categoryName) => !isIncluded(categoryName),
    );

    await Promise.all(
      newCategories.map(async (categoryName) => {
        //create category

        const category = await this.prisma.menuItemCategory.create({
          data: {
            name: categoryName,
            restaurantId: input.restaurantId,
          },
        });

        // Create junction model entry
        return this.prisma.menuItemToMenuItemCategory.create({
          data: {
            menuItemId: id,
            menuItemCategoryId: category.id,
          },
        });
      }),
    );

    const updatedItem = this.prisma.menuItem.update({
      where: {
        id,
      },
      data: {
        name: input.name,
        description: input.description,
        price: input.price,
        imageUrl: input.imageUrl,
        inStock: input.inStock,
      },
    });

    return updatedItem;
  }

  async deleteMenuItem(id: string) {
    return this.prisma.menuItem.delete({
      where: {
        id,
      },
    });
  }
}
