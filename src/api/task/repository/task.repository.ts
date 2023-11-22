import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { Repository } from 'typeorm';
import { Task } from 'src/entities/Task.entity';

@CustomRepository(Task)
export class TaskRepository extends Repository<Task> {
  async addTask(
    userId: number,
    title: string,
    location: string,
    startTime: string,
    endTime: string,
  ): Promise<number> {
    const newTask = this.create({
      userId,
      title,
      location,
      startTime,
      endTime,
    });

    await this.save(newTask);
    return newTask.id;
  }

  async getTaskWithUserTaskDataById(id: number): Promise<Task> {
    return await this.findOne({
      where: { id },
      relations: { userTasks: true },
    });
  }

  async deleteTask(id: number): Promise<void> {
    await this.softDelete({ id });
  }
}
