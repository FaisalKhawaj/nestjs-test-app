import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import { setupSwagger } from './swagger-setup';
import { globalPrefix } from './common/constants/env';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  //  NestFactory.create: It creates a new Nest application instance,
  // which represents the core of your NestJS application.
  //This instance provides access to various functionalities for managing the application's lifecycle,
  // handling requests, and interacting with its components (modules, controllers, providers, etc.).
  const app = await NestFactory.create(AppModule, {
    snapshot: true,
    bufferLogs: true,
  });
  app.enableCors({ origin: '*', credentials: true });
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      // transform: true,
      dismissDefaultMessages: false,
      forbidNonWhitelisted: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
