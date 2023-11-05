import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from 'src/common/decorators/typeorm_ex.module';
import { UserRepository } from './repository/user.repository';
import { AuthService } from '../auth/auth.service';
import { AuthRepository } from '../auth/repository/auth.repository';
import { RefreshTokenRepository } from '../auth/repository/refreshToken.repository';
import { S3Service } from './s3/s3.service';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      UserRepository,
      AuthRepository,
      RefreshTokenRepository,
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, AuthService, S3Service],
})
export class UserModule {}
