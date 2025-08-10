import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // decorators
export class AppController {
  constructor(private readonly appService: AppService) {} // DI

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/users')
  getUsers(): { id: number; name: string }[] {
    return this.appService.getUsers();
  }
}
