import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@Nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig<any>>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'users',
              url: 'http://localhost:3005/graphql',
            },
            {
              name: 'restaurants',
              url: 'http://localhost:3006/graphql',
            },
          ],
        }),
        pollIntervalInMs: 5000,
        fallbackPollIntervalInMs: 1000,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
