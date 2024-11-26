import { NestFactory } from '@nestjs/core';
import { RestaurantsModule } from './restaurants.module';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
