import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { Repository } from 'typeorm';
import { UserTask } from 'src/entities/UserTask.entity';
import { UserTaskValueDto } from '../dto/add-task-res.dto';

@CustomRepository(UserTask)
export class UserTaskRepository extends Repository<UserTask> {
  async addUserTasks(values: UserTaskValueDto[]): Promise<void> {
    const newUserTask = this.create(values);

    await this.save(newUserTask);
    return;
  }

  async deleteUserTasks(id: number): Promise<void> {
    await this.softDelete({ taskId: id });
  }

  async deleteUserTask(id: number, userId: number): Promise<void> {
    await this.softDelete({ taskId: id, userId });
  }
}
