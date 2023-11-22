import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './repository/task.repository';
import { UserTaskRepository } from './repository/userTask.repository';
import { AddTaskRequestDto } from './dto/add-task-req.dto';
import { errorResponseMessage } from 'src/common/constants/responseMessage';
import { DataSource } from 'typeorm';
import { FriendRepository } from '../friend/repository/friend.repository';
import { UserTaskValueDto } from './dto/add-task-res.dto';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly userTaskRepository: UserTaskRepository,
    private readonly friendRepository: FriendRepository,
    private dataSource: DataSource,
  ) {}

  async addTask(userId: number, addTaskRequestDto: AddTaskRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        title,
        location,
        startTime,
        endTime,
        friendIds,
        color,
        isPrivate,
      } = addTaskRequestDto;

      if (startTime > endTime) {
        throw new BadRequestException(errorResponseMessage.INVALID_DATE_ERROR);
      }

      // Task 테이블에 data insert 후 taskId 반환
      const newTaskId = await queryRunner.manager
        .withRepository(this.taskRepository)
        .addTask(userId, title, location, startTime, endTime);

      // request body로 들어온 friendIds 배열에 값이 있으면 Friend 테이블에서 해당 ids로 조회
      // 조회한 data에서 userId를 모아서 userIdsOfFriends 배열에 담고 friendIds 배열의 길이롸 비교하여 error throw
      const userIdsOfFriends: number[] = [];
      if (friendIds.length) {
        const existedFriendData =
          await this.friendRepository.getFriendsByIds(friendIds);

        existedFriendData.map((o) => {
          if (o.fromUserId !== userId) {
            userIdsOfFriends.push(o.fromUserId);
          }

          if (o.toUserId !== userId) {
            userIdsOfFriends.push(o.toUserId);
          }
        });

        if (userIdsOfFriends.length !== friendIds.length) {
          throw new NotFoundException(errorResponseMessage.CANT_FIND_FRIEND_ID);
        }
      }

      // userIdsOfFriends 배열에 task의 host인 userId도 담고
      // 해당 값들로 UserTask 테이블에 넣을 값의 value 배열을 가공 후 DB insert
      userIdsOfFriends.push(userId);
      const values: UserTaskValueDto[] = [];
      userIdsOfFriends.reduce((acc, cur) => {
        acc.push({
          taskId: newTaskId,
          userId: cur,
          color,
          isPrivate,
        });
        return acc;
      }, values);

      await queryRunner.manager
        .withRepository(this.userTaskRepository)
        .addUserTasks(values);

      await queryRunner.commitTransaction();
      return;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async deleteTask(userId: number, id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const taskData =
        await this.taskRepository.getTaskWithUserTaskDataById(id);

      const userIds: number[] = [];
      taskData.userTasks.map((o) => {
        userIds.push(o.userId);
      });

      if (!taskData || !userIds.includes(userId)) {
        throw new NotFoundException(errorResponseMessage.CANT_FIND_TASK_ID);
      }

      /**
       * <일정의 host가 user인지 아닌지에 따라 로직 분기처리>
       *  - host일 경우: Task 테이블과 taskId가 일치하는 UserTask 테이블의 모든 data soft delete
       *    (task가 연결된 참석자들의 모든 task가 동시에 삭제됨)
       *  - host가 아닐 경우: UserTask 테이블에서 userId, taskId가 일치하는 data soft delete
       *    (다른 참석자들의 task에는 영향을 주지 않음)
       */
      if (taskData.userId === userId) {
        await queryRunner.manager
          .withRepository(this.userTaskRepository)
          .deleteUserTasks(id);

        await queryRunner.manager
          .withRepository(this.taskRepository)
          .deleteTask(id);
      } else {
        await queryRunner.manager
          .withRepository(this.userTaskRepository)
          .deleteUserTask(id, userId);
      }
      await queryRunner.commitTransaction();
      return;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
