import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmExModule } from 'src/common/decorators/typeorm_ex.module';
import { FriendRepository } from './repository/friend.repository';
import { UserRepository } from '../user/repository/user.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([FriendRepository, UserRepository]),
  ],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
