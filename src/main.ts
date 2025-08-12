import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

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
  const config = new DocumentBuilder()
    .setTitle('test  example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('test')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
