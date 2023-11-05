import {
  Body,
  Controller,
  Get,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUserId } from 'src/common/decorators/get.userId.decorator';
import { JwtAuthAccessGuard } from '../auth/guard/jwt.auth.access.guard';
import { successResponseMessage } from 'src/common/constants/responseMessage';
import {
  GetUserInfoResponseDto,
  GetUserInfoResultDto,
} from './dto/get-user-res.dto';
import { UserNotificationToggleResponseDto } from './dto/notification-res.dto';
import {
  NullValueErrorDto,
  ResultWithoutDataDto,
} from 'src/common/constants/response.dto';
import { UpdateUserThemeResponseDto } from './dto/theme-res.dto';
import { UpdateUserThemeRequestDto } from './dto/theme-req.dto';
import {
  UpdateUserInfoResponseDto,
  UpdateUserInfoResultDto,
} from './dto/update-user-res.dto';
import { UpdateUserInfoRequestDto } from './dto/update-user-req.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3/s3.service';
import { multerOptions } from './s3/multer.option';

@Controller('user')
@ApiTags('User API')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthAccessGuard)
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
  @UseGuards(JwtAuthAccessGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: `유저의 닉네임, 생일, image 파일을 받아서 정보를 수정한다.
    <br>image 파일은 필수값이 아님. 프로필 사진을 변경할 때만 form-data에 담아서 전송.
    <br>닉네임과 생일은 필수값. 유저가 변경하지 않더라도 이전의 정보를 담아서 전송.`,
  })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: '유저 정보 수정 성공',
    type: UpdateUserInfoResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Request Body에 필요한 값이 없습니다.',
    type: NullValueErrorDto,
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: '이미지 파일을 전송한다',
        },
        nickname: {
          type: 'string',
          description: '유저의 닉네임',
          example: 'sumin',
        },
        birthday: {
          type: 'string',
          description: '유저의 생일',
          example: '1021',
        },
      },
    },
  })
  async updateUserInfo(
    @GetUserId() userId: number,
    @UploadedFile() image: Express.Multer.File,
    @Body() updateUserInfoRequestDto: UpdateUserInfoRequestDto,
  ): Promise<UpdateUserInfoResultDto> {
    try {
      const user = await this.userService.updateUserInfo(
        userId,
        image,
        updateUserInfoRequestDto,
      );
      const data = {
        user,
        message: successResponseMessage.UPDATE_USER_INFO_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Put('/notification')
  @UseGuards(JwtAuthAccessGuard)
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
  @UseGuards(JwtAuthAccessGuard)
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
