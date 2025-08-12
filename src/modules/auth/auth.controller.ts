import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {} // DI

  @ApiOperation({ summary: 'login api' })
  @ApiOkResponse()
  @HttpCode(200)
  @Post('signIn')
  async signIn(@Body() body: AuthDto) {
    console.log('body', body);
    return this.authService.signIn(body);
  }

  @ApiOperation({ summary: 'signup' })
  @ApiOkResponse()
  @HttpCode(200)
  @Post('signUp')
  async signUp(@Body() body: SignupDto) {
    return this.authService.signUp(body);
  }
}
