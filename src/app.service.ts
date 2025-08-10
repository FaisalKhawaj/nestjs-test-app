import { Injectable } from '@nestjs/common';

@Injectable() //  decorators
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getUsers(): { id: number; name: string }[] {
    const users = [
      {
        id: 1,
        name: 'Faisal',
      },
      {
        id: 2,
        name: 'Ali',
      },
    ];
    return users;
  }
}
