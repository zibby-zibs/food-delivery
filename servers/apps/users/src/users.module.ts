import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@Nestjs/apollo';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaModule } from './prisma/prisma.module';
import { UsersResolver } from './user.resolver';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ClearRolesMiddleware } from './middleware/auth.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2,
      },
    }),
    PrismaModule,
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    ConfigService,
    JwtService,
    UsersResolver,
    EmailService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClearRolesMiddleware).forRoutes(UsersController); // Apply to all routes or specify routes if needed
  }
}
