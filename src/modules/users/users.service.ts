import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getAllUsers(): string {
    return 'sss';
  }

  async getByUserByEmail(email: string) {
    // const user=await th
  }

  //
}
