import {
  Body,
  Controller,
  Delete,
  Post,
  Put,
  Get,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';
import { JwtAuthAccessGuard } from '../auth/guard/jwt.auth.access.guard';
import { AddTaskResponseDto } from './dto/add-task-res.dto';
import { GetUserId } from 'src/common/decorators/get.userId.decorator';
import { AddTaskRequestDto } from './dto/add-task-req.dto';
import {
  NullValueErrorDto,
  ResultWithoutDataDto,
} from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';
import { DeleteTaskResponseDto } from './dto/delete-task-res.dto';
import {
  CantFindTaskIdErrorDto,
  InvalidDateErrorDto,
  CantFindUserIdErrorDto,
} from './dto/error.dto';
import { UpdateTaskResponseDto } from './dto/update-task-res.dto';
import { UpdateTaskRequestDto } from './dto/update-task-req.dto';
import {
  GetTaskDetailResponseDto,
  GetTaskDetailResultDto,
} from './dto/get-task-detail-res.dto';
import {
  GetTaskDateResponseDto,
  GetTaskDateResultDto,
} from './dto/get-task-date-res.dto';

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
    <br> 참석자는 userId를 담은 배열의 형태. 개인 일정이라면 빈 배열로 보낼 것. 일정을 추가한 유저가 일정의 호스트가 됨.
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
    description: '해당 유저 ID가 존재하지 않습니다.',
    type: CantFindUserIdErrorDto,
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

  @Get('detail')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOperation({
    summary: '상세 일정 조회 API',
    description: `task id와 user id에 해당하는 일정의 상세내용을 조회한다. query param으로 입력하는 userId는 접속자가 아닌 조회하고자 하는 일정의 userId.`,
  })
  @ApiResponse({
    status: 200,
    description: '상세 일정 조회 성공',
    type: GetTaskDetailResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '해당 유저 ID가 존재하지 않습니다.',
    type: CantFindUserIdErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 일정 ID가 존재하지 않습니다.',
    type: CantFindTaskIdErrorDto,
  })
  async getTaskDetail(
    @Query('id') id: number,
    @Query('userId') userId: number,
  ): Promise<GetTaskDetailResultDto> {
    try {
      const task = await this.taskService.getTaskDetail(id, userId);
      const data = {
        task,
        message: successResponseMessage.GET_TASK_DETAIL_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Get('date')
  @UseGuards(JwtAuthAccessGuard)
  @ApiOperation({
    summary: '유저 전체 일정 조회 API',
    description: `startTime과 endTime에 해당하는 유저 전체 일정을 조회한다. query param으로 입력하는 userId는 접속자가 아닌 조회하고자 하는 일정의 userId.
    <br> 시작시각과 종료시각의 형태는 date.toISOString()의 형태인 2023-11-22T22:30:00로 보낼 것.`,
  })
  @ApiResponse({
    status: 200,
    description: '유저 전체 일정 조회 성공',
    type: GetTaskDateResponseDto,
  })
  async getTaskDate(
    @Query('startTime') startTime: Date,
    @Query('endTime') endTime: Date,
    @Query('userId') userId: number,
  ): Promise<GetTaskDateResultDto> {
    try {
      const task = await this.taskService.getTaskDate(
        startTime,
        endTime,
        userId,
      );
      const data = {
        task,
        message: successResponseMessage.GET_TASK_DATE_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Put()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOperation({
    summary: '일정 수정 API',
    description: `일정의 id, 제목, 장소, 참석자, 시작시각, 종료시각, 색깔, 공개여부를 받아서 일정을 수정한다.
    <br> 호스트인 user는 모든 값이 필수값. 그 외의 user는 색깔과 공개여부만 필수값.
    <br> 호스트인 user만 제목, 장소, 참석자, 시작시각, 종료시각을 수정할 수 있음.
    <br> 색깔과 공개여부는 같은 task라도 유저마다 다르게 수정 가능. 모든 user가 수정할 수 있음.`,
  })
  @ApiResponse({
    status: 200,
    description: '일정 수정 성공',
    type: UpdateTaskResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Request Body에 필요한 값이 없습니다.',
    type: NullValueErrorDto,
  })
  @ApiResponse({
    status: 401,
    description:
      '일정의 시작시각이 종료시각보다 늦을 수 없습니다. 실제코드 400.',
    type: InvalidDateErrorDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 일정 ID가 존재하지 않습니다.',
    type: CantFindTaskIdErrorDto,
  })
  @ApiResponse({
    status: 414,
    description: '해당 유저 ID가 존재하지 않습니다. 실제 코드 404',
    type: CantFindUserIdErrorDto,
  })
  async updateTask(
    @GetUserId() userId: number,
    @Body() updateTaskRequestDto: UpdateTaskRequestDto,
  ): Promise<ResultWithoutDataDto> {
    try {
      await this.taskService.updateTask(userId, updateTaskRequestDto);
      const data = {
        message: successResponseMessage.UPDATE_TASK_SUCCESS,
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
