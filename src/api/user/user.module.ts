import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmExModule } from 'src/common/decorators/typeorm_ex.module';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [TypeOrmExModule.forCustomRepository([UserRepository])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
