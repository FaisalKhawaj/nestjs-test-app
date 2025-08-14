import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EMAIL_ALREADY_EXIST_RESPONSE,
  INVALID_OTP,
  OTP_EXPIRED,
  OTP_SEND_SUCCESS,
  USER_NOT_FOUND_RESPONSE,
} from 'src/common/constants/http-responses.types';
import { User } from 'src/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { SignupDto } from '../auth/dto/signup.dto';
import { Helper } from 'src/utils/helper';
import { MailerService } from 'src/shared/mailer/mailer.service';
import { buildVerificationEmail } from 'src/common/templates/email.template';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { buildResendOtpEmail } from 'src/common/templates/resend-otp.template';
import { buildForgotPasswordEmail } from 'src/common/templates/forgot-password.template';
import { NewPasswordDto } from '../auth/dto/set-new-password.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
    private mailService: MailerService,
  ) {}

  getAllUsers(): string {
    return 'sss';
  }

  async getByUserByEmail(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    return user;
    // const user=await th
  }

  async register(body: SignupDto) {
    const {
      email,
      password,
      fullName,
      userName,
      state,
      country,
      city,
      gender,
      dateOfBirth,
      phoneNumber,
    } = body;
    const res = await this.userRepo.manager.transaction(
      async (entityManager) => {
        const isUser = await entityManager.findOne(User, {
          where: { email },
        });

        if (isUser)
          throw new HttpException(
            EMAIL_ALREADY_EXIST_RESPONSE.message,
            EMAIL_ALREADY_EXIST_RESPONSE.status,
          );
        const otpCode = Helper.generateOTP(6);
        const otpExpiry = new Date();
        const user = new User();
        user.password = password;
        user.fullName = fullName;
        user.userName = userName;
        user.gender = gender;
        user.email = email;
        user.dateOfBirth = dateOfBirth;
        user.phoneNumber = phoneNumber;

        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        user.otpCode = otpCode;
        user.otpExpiry = otpExpiry;
        user.country = country;
        user.state = state;
        user.city = city;
        await entityManager.save([user]);

        await this.mailService.sendMail(
          email,
          'Email Verification OTP',
          buildVerificationEmail({
            otpCode,
            appName: 'GGS',
            supportEmail: 'support@ggs.app',
            expiresInMinutes: 10,
          }),
          `Your GGS App OTP code is ${otpCode}. It expires in 10 minutes.`,
        );
        return await entityManager.findOne(User, {
          where: { email },
          // relations: {
          //   userProfile: true,
          // },
          select: {
            id: true,
            email: true,
            userName: true,
            dateOfBirth: true,
            country: true,
            state: true,
            city: true,
            createdAt: true,
            updatedAt: true,
            isActive: true,
            isVerified: true,
            isBlocked: true,
            isForgotPassword: true,
            otpCode: true,
            otpExpiry: true,
          },
        });
      },
    );
    return Object.defineProperty(res, 'password', {
      enumerable: false,
    });
  }

  async verifyEmail(body: VerifyOtpDto) {
    const { email, otpCode } = body;
    const user = await this.userRepo.findOne({
      where: { email, isVerified: false },
    });
    console.log('useruseruser', user);
    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }
    if (user.otpCode !== otpCode) {
      throw new HttpException(INVALID_OTP.message, INVALID_OTP.status);
    }
    const currentTime = new Date();
    const otpExpiry = new Date(user.otpExpiry);
    if (currentTime > otpExpiry) {
      throw new HttpException(OTP_EXPIRED.message, OTP_EXPIRED.status);
    }
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiry = null;
    await this.userRepo.save(user);
    return {
      data: user,
      messsage: 'Account verified successfully',
    };
  }

  async resendOtpCode(email: string) {
    await this.userRepo.manager.transaction(async (entityManager) => {
      const IsUser = await entityManager.findOne(User, { where: { email } });

      if (!IsUser) {
        throw new HttpException(
          USER_NOT_FOUND_RESPONSE.message,
          USER_NOT_FOUND_RESPONSE.status,
        );
      }
      const otpCode = Helper.generateOTP(6);
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
      IsUser.otpCode = otpCode;
      IsUser.otpExpiry = otpExpiry;
      await entityManager.save(IsUser);
      await this.mailService.sendMail(
        email,
        'OTP Resent',
        buildResendOtpEmail({
          otpCode,
          appName: 'GGS',
          supportEmail: 'support@ggs.app',
          expiresInMinutes: 10,
        }),
        `Your GGS App OTP code is ${otpCode}. It expires in 10 minutes.`,
      );
      return await entityManager.findOne(User, {
        where: { email },
      });
    });
    return {
      status: OTP_SEND_SUCCESS.status,
      message: OTP_SEND_SUCCESS.message,
      data: [],
    };
  }

  async forgotPassword(email: string) {
    await this.userRepo.manager.transaction(async (entityManager) => {
      const isUser = await entityManager.findOne(User, { where: { email } });
      if (!isUser) {
        throw new HttpException(
          USER_NOT_FOUND_RESPONSE.message,
          USER_NOT_FOUND_RESPONSE.status,
        );
      }
      const otpCode = Helper.generateOTP(6);
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
      isUser.otpCode = otpCode;
      isUser.otpExpiry = otpExpiry;
      isUser.isForgotPassword = true;
      await entityManager.save(isUser);
      await this.mailService.sendMail(
        email,
        'Reset Password',
        buildForgotPasswordEmail({
          otpCode,
          appName: 'GGS',
          supportEmail: 'support@ggs.app',
          expiresInMinutes: 10,
        }),
        `Your GGS App OTP code is ${otpCode}. It expires in 10 minutes.`,
      );
      return await entityManager.findOne(User, {
        where: { email },
      });
    });
    return {
      status: OTP_SEND_SUCCESS.status,
      message: OTP_SEND_SUCCESS.message,
      data: [],
    };
  }

  async resetPassword(body: NewPasswordDto) {
    const { email, password } = body;
    const res = await this.userRepo.manager.transaction(
      async (entityManager) => {
        const isUser = await entityManager.findOne(User, { where: { email } });
        if (!isUser) {
          throw new HttpException(
            USER_NOT_FOUND_RESPONSE.message,
            USER_NOT_FOUND_RESPONSE.status,
          );
        }
        const hashedPassword = await Helper.hashPassword(password);
        isUser.password = hashedPassword;
        isUser.isForgotPassword = false;
        isUser.otpCode = null;
        isUser.otpExpiry = null;
        await entityManager.save(isUser);
        return await entityManager.findOne(User, {
          where: { email },
        });
      },
    );
    return Object.defineProperty(res, 'password', {
      enumerable: false,
    });
  }
  //
}
