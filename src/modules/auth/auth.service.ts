import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  createUser() {}

  async signIn(body: AuthDto) {
    console.log('body', body);
  }

  async signUp(body: SignupDto) {
    console.log('signUp body', body);
    return 'success';
  }
}
