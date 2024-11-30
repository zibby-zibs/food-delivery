import { NestFactory } from '@nestjs/core';
import { RestaurantsModule } from './restaurants.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(RestaurantsModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'servers/email-templates'));
  app.setViewEngine('ejs');
  await app.listen(process.env.port ?? 3006);
}
bootstrap();
