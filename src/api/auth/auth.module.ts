import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './repository/auth.repository';
import { TypeOrmExModule } from 'src/common/decorators/typeorm_ex.module';
import { UserRepository } from '../user/repository/user.repository';
import { RefreshTokenRepository } from './repository/refreshToken.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      AuthRepository,
      UserRepository,
      RefreshTokenRepository,
    ]),
    JwtModule.register({ global: true, secret: process.env.TOKEN_SECRET_KEY }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
