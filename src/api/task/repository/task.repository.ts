import { CustomRepository } from 'src/common/decorators/typeorm_ex.decorator';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Task } from 'src/entities/Task.entity';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

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
      relations: { userTasks: { user: true } },
    });
  }

  async getTasksWithUserTaskDataByDateAndUserId(
    startAt: Date,
    endAt: Date,
    userId: number,
  ): Promise<Task[]> {
    return await this.find({
      where: [
        { startTime: Between(startAt, endAt), userTasks: { userId } },
        { endTime: Between(startAt, endAt), userTasks: { userId } },
        {
          startTime: LessThanOrEqual(startAt),
          endTime: MoreThanOrEqual(endAt),
          userTasks: { userId },
        },
      ],
      relations: { userTasks: true },
      order: { startTime: 'ASC' },
    });
  }

  async updateTaskById(
    id: number,
    updateColumn: QueryDeepPartialEntity<Task>,
  ): Promise<void> {
    await this.update({ id }, updateColumn);
    return;
  }

  async deleteTask(id: number): Promise<void> {
    await this.softDelete({ id });
    return;
  }
}
