import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsResolver } from './restaurants.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import {
  ApolloFederationDriverConfig,
  ApolloFederationDriver,
} from '@Nestjs/apollo';
import { EmailService } from 'apps/users/src/email/email.service';
import { PrismaModule } from 'apps/users/src/prisma/prisma.module';
import { EmailModule } from 'apps/users/src/email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
    EmailModule,
    PrismaModule,
  ],
  providers: [
    RestaurantsResolver,
    RestaurantsService,
    EmailService,
    ConfigService,
    JwtService,
  ],
})
export class RestaurantsModule {}
