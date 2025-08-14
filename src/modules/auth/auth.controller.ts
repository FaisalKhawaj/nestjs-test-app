import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthDto } from './dto/auth.dto';
import { SignupDto } from './dto/signup.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UserService } from '../users/users.service';
import { NewPasswordDto } from './dto/set-new-password.dto';

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

  @ApiOperation({ summary: 'Verify Account' })
  @ApiOkResponse()
  @HttpCode(201)
  @Post('verify-account')
  async verifyEmail(@Body() body: VerifyOtpDto) {
    return this.authService.verifyEmail(body);
  }

  @ApiOperation({ summary: 'Resend Otp' })
  @ApiOkResponse()
  @HttpCode(201)
  @Post('resend-otp/:email')
  async resendOtpCode(@Param('email') email: string) {
    return this.authService.resendOtpCode(email);
  }

  @ApiOperation({ summary: 'Forgot Password' })
  @ApiOkResponse()
  @HttpCode(201)
  @Post('forgot-password/:email')
  async forgotPassword(@Param('email') email: string) {
    return this.authService.forgetPassword(email);
  }

  @ApiOperation({ summary: 'Verify Forgot Password OTP' })
  @ApiOkResponse()
  @Post('reset-verify-otp')
  async verifyOtpCode(@Body() body: VerifyOtpDto) {
    return this.authService.verifyForgetPasswordOtp(body);
  }

  @ApiOperation({ summary: 'Set New Password' })
  @ApiOkResponse()
  @Post('set-new-password')
  async setNewPassword(@Body() body: NewPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
