import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/shared/strategy/jwt.strategy';

const jwtFactory = {
  useFactory: async (config: ConfigService) => {
    return {
      secret: config.get<string>('JWT_SECRET'),
      signOptions: {
        expiresIn: config.get<string>('JWT_EXPIRES_IN'),
      },
    };
  },
  inject: [ConfigService],
};

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtFactory),
    TypeOrmModule.forFeature([User]), // ✅ Register repository here
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtModule],
  //   providers:[Auth]
})
export class AuthModule {}
