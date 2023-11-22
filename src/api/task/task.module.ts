import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TypeOrmExModule } from 'src/common/decorators/typeorm_ex.module';
import { TaskRepository } from './repository/task.repository';
import { UserTaskRepository } from './repository/userTask.repository';
import { FriendRepository } from '../friend/repository/friend.repository';

@Module({
  imports: [
    TypeOrmExModule.forCustomRepository([
      TaskRepository,
      UserTaskRepository,
      FriendRepository,
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
