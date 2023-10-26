import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUserId } from 'src/common/decorators/get.userId.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { successResponseMessage } from 'src/common/constants/responseMessage';
import {
  GetUserInfoResponseDto,
  GetUserInfoResultDto,
} from './dto/get-user-res.dto';
import { UserNotificationToggleResponseDto } from './dto/notification-res.dto';
import { ResultWithoutDataDto } from 'src/common/constants/response.dto';
import { UpdateUserThemeResponseDto } from './dto/theme-res.dto';
import { UpdateUserThemeRequestDto } from './dto/theme-req.dto';
import { UpdateUserInfoResponseDto } from './dto/update-user-res.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-req.dto';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 정보 조회 API',
    description: `accessToken에 담겨있는 userId를 통해 유저의 정보를 조회한다.`,
  })
  @ApiResponse({
    status: 200,
    description: '유저 정보 조회 성공',
    type: GetUserInfoResponseDto,
  })
  async getUserInfo(
    @GetUserId() userId: number,
  ): Promise<GetUserInfoResultDto> {
    try {
      const user = await this.userService.getUserInfo(userId);
      const data = {
        user,
        message: successResponseMessage.GET_USER_INFO_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: `유저의 닉네임, 생일, 프로필 url을 받아서 정보를 수정한다.`,
  })
  @ApiResponse({
    status: 200,
    description: '유저 정보 수정 성공',
    type: UpdateUserInfoResponseDto,
  })
  async updateUserInfo(
    @GetUserId() userId: number,
    @Body() updateUserInfoRequestDto: UpdateUserInfoRequestDto,
  ): Promise<ResultWithoutDataDto> {
    try {
      await this.userService.updateUserInfo(userId, updateUserInfoRequestDto);
      const data = {
        message: successResponseMessage.UPDATE_USER_INFO_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Put('/notification')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '알림 설정 토글 API',
    description: `유저의 알림 설정 토글을 switch 한다.`,
  })
  @ApiResponse({
    status: 200,
    description: '알림 허용 || 알림 거부',
    type: UserNotificationToggleResponseDto,
  })
  async notificationToggle(
    @GetUserId() userId: number,
  ): Promise<ResultWithoutDataDto> {
    try {
      const toggleStatus = await this.userService.notificationToggle(userId);
      const data = {
        message: toggleStatus
          ? successResponseMessage.NOTIFICATION_TOGGLE_ON_SUCCESS
          : successResponseMessage.NOTIFICATION_TOGGLE_OFF_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Put('/theme')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '메인 테마 변경 API',
    description: `유저의 메인 테마 색상을 변경한다. (white 또는 black) default는 white.`,
  })
  @ApiResponse({
    status: 200,
    description: '메인 테마 변경 성공',
    type: UpdateUserThemeResponseDto,
  })
  async updateUserTheme(
    @GetUserId() userId: number,
    @Body() updateUserThemeRequestDto: UpdateUserThemeRequestDto,
  ): Promise<ResultWithoutDataDto> {
    try {
      await this.userService.updateUserTheme(userId, updateUserThemeRequestDto);
      const data = {
        message: successResponseMessage.UPDATE_USER_THEME_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
