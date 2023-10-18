import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { GetUserId } from 'src/common/decorators/get.userId.decorator';
import { JwtAuthGuard } from '../auth/guard/jwt.auth.guard';
import { successResponseMessage } from 'src/common/constants/responseMessage';

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
  async getUserInfo(@GetUserId() userId: number) {
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
}
