import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EMAIL_ALREADY_EXIST_RESPONSE,
  INTERNAL_SERVER_ERROR_RESPONSE,
  INVALID_OTP,
  NOT_FOUND_RESPONSE,
  OLD_PASSWORD_INVALID,
  OPERATION_FAILED_RESPONSE,
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
import { UserProfile } from 'src/entities/user.profile.entity';
import { ChangePasswordDto } from './dto/update-password.dto';

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

  async getUserByEmail(email: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: { userProfile: true },
    });
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
        user.userName = userName;
        user.email = email;

        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);
        user.otpCode = otpCode;
        user.otpExpiry = otpExpiry;
        user.country = country;
        user.state = state;
        user.city = city;
        const userProfile = new UserProfile();
        userProfile.fullName = fullName;
        userProfile.gender = gender;
        userProfile.dateOfBirth = dateOfBirth;
        userProfile.phoneNumber = phoneNumber;
        user.userProfile = userProfile;
        await entityManager.save(user); // cascade will save profile too

        // await entityManager.save([user, userProfile]);

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
          relations: {
            userProfile: true,
          },
          select: {
            id: true,
            email: true,
            userName: true,
            userProfile: {
              id: true,
              fullName: true,
              gender: true,
              dateOfBirth: true,
              profileImage: true,
              coverImage: true,
            },
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
  async findOne(userId: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: {
        userProfile: true,
      },
    });
    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }
    return Object.defineProperty(user, 'password', {
      enumerable: false,
    });
  }

  async softDeleteUser(userId: string) {
    const result = await this.userRepo.softDelete(userId);
    if (!result || !result.affected) {
      throw new HttpException(
        NOT_FOUND_RESPONSE.message,
        NOT_FOUND_RESPONSE.status,
      );
    }
    return;
  }

  async deleteUser(userId: string) {
    const result = await this.userRepo.delete(userId);
    if (!result || !result.affected) {
      throw new HttpException(
        NOT_FOUND_RESPONSE.message,
        NOT_FOUND_RESPONSE.status,
      );
    }
    return;
  }

  async updateUserPassword(body: ChangePasswordDto, userId: string) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new HttpException(
        USER_NOT_FOUND_RESPONSE.message,
        USER_NOT_FOUND_RESPONSE.status,
      );
    }
    const isMatch = await Helper.comparePassword(
      body.oldPassword,
      user.password,
    );
    if (!isMatch) {
      throw new HttpException(
        OLD_PASSWORD_INVALID.message,
        OLD_PASSWORD_INVALID.status,
      );
    }
    if (body.oldPassword === body.newPassword) {
      throw new HttpException(
        'New password cannot be same as old password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hashedNewPass = await Helper.hashPassword(body.newPassword);
    try {
      const updatedResult = await this.userRepo.update(userId, {
        password: hashedNewPass,
      });
      if (updatedResult.affected === 0) {
        throw new HttpException(
          OPERATION_FAILED_RESPONSE.message,
          OPERATION_FAILED_RESPONSE.status,
        );
      }
      return { message: 'Password updated successfully' }; // Good to send confirmation
    } catch (error) {
      throw new HttpException(
        INTERNAL_SERVER_ERROR_RESPONSE.message,
        INTERNAL_SERVER_ERROR_RESPONSE.status,
      );
    }
  }
}
