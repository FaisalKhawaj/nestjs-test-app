import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { UserService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { UserRepository } from '../users/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import {
  EMAIL_ALREADY_EXIST_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
  OTP_VERIFY_SUCCESS,
  SUCCESSFUL_RESPONSE,
  USER_NOT_FOUND_RESPONSE,
  WRONG_OTP,
} from 'src/common/constants/http-responses.types';
import { Helper } from 'src/utils/helper';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtPayload } from 'src/common/interface/Jwt.interface';
import { NewPasswordDto } from './dto/set-new-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async createUser() {}

  public createAccessToken(payload: JwtPayload): string {
    try {
      const result = this.jwtService.sign(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN'),
      });

      return result;
    } catch (error) {
      throw new HttpException(
        error?.message || INTERNAL_SERVER_ERROR_RESPONSE.message,
        INTERNAL_SERVER_ERROR_RESPONSE.status,
      );
    }
  }

  async signIn(body: AuthDto) {
    console.log('body', body);
    const user = await this.userService.getByUserByEmail(body.email);
    if (!user) {
      throw new HttpException('Invalid email/password', HttpStatus.NOT_FOUND);
    }
    if (!user.isVerified) {
      throw new HttpException('Email not verified', HttpStatus.NOT_FOUND);
    }
    const { password, ...rest } = user;
    console.log('Comparing passwords:', body.password, password);

    const verifyPassword = await Helper.comparePassword(
      body.password,
      password,
    );
    if (!verifyPassword) {
      throw new HttpException('Invalid email/password', HttpStatus.NOT_FOUND);
    }
    const jwt_token = this.createAccessToken({
      id: user.id,
      email: user.email,
    });
    console.log('JWT before encryption:', jwt_token);

    const encryptedToken = Helper.encryption(jwt_token);
    console.log('encryptedToken', encryptedToken);
    return {
      status: HttpStatus.OK,
      data: {
        ...rest,
        access_token: encryptedToken,
      },
    };
  }

  async signUp(body: SignupDto) {
    const user = await this.userService.register(body);
    console.log('useruser:', user);
    const jwt_token = this.createAccessToken({
      id: user.id,
      email: user.email,
    });
    const encryptedToken = Helper.encryption(jwt_token as string);
    return {
      status: HttpStatus.OK,
      data: {
        ...user,
        access_token: encryptedToken,
      },
    };
  }

  async verifyEmail(body: VerifyOtpDto) {
    try {
      const response = await this.userService.verifyEmail(body);
      console.log('response', response);
    } catch (error) {
      throw new HttpException(
        error?.message || INTERNAL_SERVER_ERROR_RESPONSE.message,
        error.status || INTERNAL_SERVER_ERROR_RESPONSE.status,
      );
    }
  }

  async resendOtpCode(email: string) {
    try {
      const response = await this.userService.resendOtpCode(email);
      console.log('responseresponse', response);
    } catch (error) {
      throw new HttpException(
        error?.message || INTERNAL_SERVER_ERROR_RESPONSE.message,
        error.status || INTERNAL_SERVER_ERROR_RESPONSE.status,
      );
    }
  }

  async forgetPassword(email: string) {
    try {
      const response = await this.userService.forgotPassword(email);
      console.log('responseresponse', response);
    } catch (error) {
      throw new HttpException(
        error?.message || INTERNAL_SERVER_ERROR_RESPONSE.message,
        error.status || INTERNAL_SERVER_ERROR_RESPONSE.status,
      );
    }
  }

  async verifyForgetPasswordOtp(body: VerifyOtpDto) {
    const { email, otpCode } = body;
    const user = await this.userService.getByUserByEmail(email);
    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }
    if (!user.isForgotPassword) {
      throw new HttpException('OTP not requested', HttpStatus.BAD_REQUEST);
    }
    if (otpCode !== user.otpCode) {
      throw new HttpException(WRONG_OTP.message, WRONG_OTP.status);
    }
    const currentTime = new Date();
    const otpExpiry = new Date(user.otpExpiry);
    if (currentTime > otpExpiry) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }
    return {
      status: SUCCESSFUL_RESPONSE.status,
      message: OTP_VERIFY_SUCCESS.message,
      data: [],
    };
  }

  async resetPassword(body: NewPasswordDto) {
    const res = await this.userService.resetPassword(body);
    return res;
  }
}
