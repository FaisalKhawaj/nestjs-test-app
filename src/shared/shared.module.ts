import { Global, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from './logger/logger.module';
import { MailerModule } from './mailer/mailer.module';
import { ResponseInterceptor } from 'src/common/interceptors/response.interceptor';

@Global()
@Module({
  imports: [LoggerModule.forRoot(), MailerModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class SharedModule {}
