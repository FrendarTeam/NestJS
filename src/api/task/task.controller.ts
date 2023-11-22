import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthAccessGuard } from '../auth/guard/jwt.auth.access.guard';
import { AddTaskResponseDto } from './dto/add-task-res.dto';
import { GetUserId } from 'src/common/decorators/get.userId.decorator';
import { AddTaskRequestDto } from './dto/add-task-req.dto';
import { ResultWithoutDataDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';
import { DeleteTaskResponseDto } from './dto/delete-task-res.dto';
import {
  CantFindFriendIdErrorDto,
  CantFindTaskIdErrorDto,
  InvalidDateErrorDto,
} from './dto/error.dto';

@Controller('task')
@ApiTags('Task API')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOperation({
    summary: '일정 추가 API',
    description: `일정의 제목, 장소, 참석자, 시작시각, 종료시각, 색깔, 공개여부를 받아서 캘린더에 등록한다.
    <br> 모든 값은 필수값.
    <br> 참석자는 friendId를 담은 배열의 형태. 개인 일정이라면 빈 배열로 보낼 것. 일정을 추가한 유저가 일정의 호스트가 됨.
    <br> 시작시각과 종료시각의 형태는 date.toISOString()의 형태인 2023-11-22T22:30:00로 보낼 것.
    <br> 공개여부는 boolean type.`,
  })
  @ApiResponse({
    status: 201,
    description: '일정 추가 성공',
    type: AddTaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '일정의 시작시각이 종료시각보다 늦을 수 없습니다.',
    type: InvalidDateErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 친구 ID가 존재하지 않습니다.',
    type: CantFindFriendIdErrorDto,
  })
  async addTask(
    @GetUserId() userId: number,
    @Body() addTaskRequestDto: AddTaskRequestDto,
  ): Promise<ResultWithoutDataDto> {
    try {
      await this.taskService.addTask(userId, addTaskRequestDto);
      const data = {
        message: successResponseMessage.ADD_TASK_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Delete()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOperation({
    summary: '일정 삭제 API',
    description: `task id를 받아서 일치하는 데이터를 삭제한다. 
    <br> user가 task의 host일 경우, 연결된 모든 userTask의 row도 함께 삭제한다.
    <br> user가 task의 host가 아닌 참석자일 경우, 다른 참석자들의 task에 영향을 주지 않고 해당 user의 userTask만 삭제한다.`,
  })
  @ApiResponse({
    status: 200,
    description: '일정 삭제 성공',
    type: DeleteTaskResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 일정 ID가 존재하지 않습니다.',
    type: CantFindTaskIdErrorDto,
  })
  async DeleteTask(
    @GetUserId() userId: number,
    @Query('id') id: number,
  ): Promise<ResultWithoutDataDto> {
    try {
      await this.taskService.deleteTask(userId, id);
      const data = {
        message: successResponseMessage.DELETE_TASK_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
