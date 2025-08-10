import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  //  NestFactory.create: It creates a new Nest application instance,
  // which represents the core of your NestJS application.
  //This instance provides access to various functionalities for managing the application's lifecycle,
  // handling requests, and interacting with its components (modules, controllers, providers, etc.).
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}
bootstrap();
