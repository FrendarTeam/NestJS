import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { In, Repository } from 'typeorm';
import { UserTask } from 'src/entities/UserTask.entity';
import { UserTaskValueDto } from '../dto/add-task-res.dto';

@CustomRepository(UserTask)
export class UserTaskRepository extends Repository<UserTask> {
  async addUserTasks(values: UserTaskValueDto[]): Promise<void> {
    const newUserTask = this.create(values);

    await this.save(newUserTask);
    return;
  }

  async updateUserTaskByIdAndUserId(
    id: number,
    userId: number,
    color: string,
    isPrivate: boolean,
  ): Promise<void> {
    await this.update({ taskId: id, userId }, { color, isPrivate });
    return;
  }

  async deleteUserTasks(id: number): Promise<void> {
    await this.softDelete({ taskId: id });
    return;
  }

  async deleteUserTasksBytaskIdAndUserIds(
    taskId: number,
    userIds: number[],
  ): Promise<void> {
    await this.softDelete({ taskId, userId: In(userIds) });
    return;
  }

  async deleteUserTask(id: number, userId: number): Promise<void> {
    await this.softDelete({ taskId: id, userId });
    return;
  }
}
