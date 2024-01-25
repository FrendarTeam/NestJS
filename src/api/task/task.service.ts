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
import { UpdateTaskRequestDto } from './dto/update-task-req.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Task } from 'src/entities/Task.entity';
import { TaskDetailDto } from './dto/get-task-detail-res.dto';
import { TaskDetailForDateDto } from './dto/get-task-date-res.dto';

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
        participants,
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

      // request body로 들어온 participants 배열에 값이 있으면 Friend 테이블에서 호스트인 userId로 조회
      // 조회한 data에서 친구관계인 userId를 모아서 userIdsOfFriends 배열에 담고 participants 배열의 원소와 비교하여 error throw
      const userIdsOfFriends: number[] = [];
      if (participants.length) {
        const existedFriendData =
          await this.friendRepository.getFriends(userId);

        existedFriendData.map((o) => {
          if (o.fromUserId !== userId) {
            userIdsOfFriends.push(o.fromUserId);
          }

          if (o.toUserId !== userId) {
            userIdsOfFriends.push(o.toUserId);
          }
        });

        participants.map((o) => {
          if (!userIdsOfFriends.includes(o)) {
            throw new NotFoundException(errorResponseMessage.CANT_FIND_USER_ID);
          }
        });
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

  async getTaskDetail(id: number, userId: number) {
    try {
      const taskData =
        await this.taskRepository.getTaskWithUserTaskDataById(id);

      if (!taskData) {
        throw new NotFoundException(errorResponseMessage.CANT_FIND_TASK_ID);
      }

      const task: TaskDetailDto = {
        id: taskData.id,
        title: taskData.title,
        location: taskData.location,
        startTime: taskData.startTime,
        endTime: taskData.endTime,
        hostId: taskData.userId,
        participants: [],
        color: null,
        isPrivate: null,
      };

      taskData.userTasks.map((o) => {
        const profileUrl = this.completeProfileUrl(o.user.profileUrl);
        task.participants.push({
          userId: o.userId,
          nickname: o.user.nickname,
          profileUrl,
        });

        if (userId === o.userId) {
          task.color = o.color;
          task.isPrivate = o.isPrivate;
        }
      });

      if (task.color === null) {
        throw new BadRequestException(errorResponseMessage.CANT_FIND_USER_ID);
      }

      return task;
    } catch (error: any) {
      throw error;
    }
  }

  async getTaskDate(startTime: Date, endTime: Date, userId: number) {
    try {
      const taskData =
        await this.taskRepository.getTasksWithUserTaskDataByDateAndUserId(
          startTime,
          endTime,
          userId,
        );

      const task: TaskDetailForDateDto[] = [];
      taskData.reduce((acc, cur) => {
        acc.push({
          id: cur.id,
          title: cur.title,
          location: cur.location,
          startTime: cur.startTime,
          endTime: cur.endTime,
          hostId: cur.userId,
          color: cur.userTasks[0].color,
          isPrivate: cur.userTasks[0].isPrivate,
        });
        return acc;
      }, task);

      return task;
    } catch (error: any) {
      throw error;
    }
  }

  async updateTask(userId: number, updateTaskRequestDto: UpdateTaskRequestDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const {
        id,
        title,
        location,
        startTime,
        endTime,
        participants,
        color,
        isPrivate,
      } = updateTaskRequestDto;

      const taskData =
        await this.taskRepository.getTaskWithUserTaskDataById(id);

      const existedUserIds: number[] = [];
      taskData?.userTasks.map((o) => {
        existedUserIds.push(o.userId);
      });

      if (!taskData || !existedUserIds.includes(userId)) {
        throw new NotFoundException(errorResponseMessage.CANT_FIND_TASK_ID);
      }

      /**
       * <일정의 host가 user인지 아닌지에 따라 로직 분기처리>
       *  - host일 경우: Task 테이블과 유저 개별 UserTask 테이블의 data update
       *    (참석자가 변경된 경우 UserTask 테이블에 추가하거나 soft delete)
       *  - host가 아닐 경우: UserTask 테이블에서 userId, taskId가 일치하는 data update
       */
      if (taskData.userId === userId) {
        if (!title || !location || !startTime || !endTime || !participants) {
          throw new BadRequestException(errorResponseMessage.NULL_VALUE);
        }

        const startTimeForValidation = startTime
          ? startTime
          : taskData.startTime;
        const endTimeForValidation = endTime ? endTime : taskData.endTime;

        if (startTimeForValidation > endTimeForValidation) {
          throw new BadRequestException(
            errorResponseMessage.INVALID_DATE_ERROR,
          );
        }

        const updateTaskColumn: QueryDeepPartialEntity<Task> = {};
        if (taskData.title !== title) {
          updateTaskColumn.title = title;
        }

        if (taskData.location !== location) {
          updateTaskColumn.location = location;
        }

        if (
          taskData.startTime.toLocaleString() !==
          new Date(startTime).toLocaleString()
        ) {
          updateTaskColumn.startTime = startTime;
        }

        if (
          taskData.endTime.toLocaleString() !==
          new Date(endTime).toLocaleString()
        ) {
          updateTaskColumn.endTime = endTime;
        }

        // 변경된 column만 업데이트
        await queryRunner.manager
          .withRepository(this.taskRepository)
          .updateTaskById(id, updateTaskColumn);

        // participants에 연결된 userIds 조회
        const existedFriendData =
          await this.friendRepository.getFriends(userId);

        const userIdsOfFriends: number[] = [];
        existedFriendData.map((o) => {
          if (o.fromUserId !== userId) {
            userIdsOfFriends.push(o.fromUserId);
          }

          if (o.toUserId !== userId) {
            userIdsOfFriends.push(o.toUserId);
          }
        });

        participants.map((o) => {
          if (!userIdsOfFriends.includes(o)) {
            throw new NotFoundException(errorResponseMessage.CANT_FIND_USER_ID);
          }
        });

        // existedUserIds 기준으로 participants의 데이터와 동일하지 않으면 soft delete
        const deleteUserIds: number[] = existedUserIds.filter(
          (x) => !participants.includes(x) && x !== userId,
        );

        if (deleteUserIds.length) {
          await queryRunner.manager
            .withRepository(this.userTaskRepository)
            .deleteUserTasksBytaskIdAndUserIds(id, deleteUserIds);
        }

        // participants 기준으로 existedUserIds의 데이터와 동일하지 않으면 UserTask 추가
        const newUserIds: number[] = participants.filter(
          (x) => !existedUserIds.includes(x),
        );

        if (newUserIds.length) {
          const values: UserTaskValueDto[] = [];
          newUserIds.reduce((acc, cur) => {
            acc.push({
              taskId: id,
              userId: cur,
              color,
              isPrivate,
            });
            return acc;
          }, values);

          await queryRunner.manager
            .withRepository(this.userTaskRepository)
            .addUserTasks(values);
        }
      }

      await queryRunner.manager
        .withRepository(this.userTaskRepository)
        .updateUserTaskByIdAndUserId(id, userId, color, isPrivate);

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
      taskData?.userTasks.map((o) => {
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

  private completeProfileUrl(profileUrl: string) {
    if (!profileUrl) {
      profileUrl = process.env.AWS_S3_DEFAULT_KEY;
    }

    if (!profileUrl.includes('kakaocdn')) {
      profileUrl = process.env.AWS_S3_URI + profileUrl;
    }

    return profileUrl;
  }
}
