import {
  Body,
  Controller,
  Delete,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendService } from './friend.service';
import { JwtAuthAccessGuard } from '../auth/guard/jwt.auth.access.guard';
import { AddFriendResponseDto } from './dto/add-friend-res.dto';
import { GetUserId } from 'src/common/decorators/get.userId.decorator';
import { AddFriendRequestDto } from './dto/add-friend-req.dto';
import { ResultWithoutDataDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';
import {
  AlreadyAddedFriendErrorDto,
  CantFindFriendIdErrorDto,
  InvalidFriendCodeErrorDto,
} from './dto/error.dto';
import { DeleteFriendResponseDto } from './dto/delete-friend.res.dto';

@Controller('friend')
@ApiTags('Friend API')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @Post()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOperation({
    summary: '친구 추가 API',
    description: `친구 코드를 입력받아서 친구 목록에 추가한다.`,
  })
  @ApiResponse({
    status: 201,
    description: '친구 추가 성공',
    type: AddFriendResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '토큰이 유효하지 않습니다.',
    type: InvalidFriendCodeErrorDto,
  })
  @ApiResponse({
    status: 409,
    description: '이미 추가한 친구입니다.',
    type: AlreadyAddedFriendErrorDto,
  })
  async addFriend(
    @GetUserId() userId: number,
    @Body() addFriendRequestDto: AddFriendRequestDto,
  ): Promise<ResultWithoutDataDto> {
    try {
      await this.friendService.addFriend(userId, addFriendRequestDto);
      const data = {
        message: successResponseMessage.ADD_FRIEND_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }

  @Delete()
  @UseGuards(JwtAuthAccessGuard)
  @ApiOperation({
    summary: '친구 삭제 API',
    description: `friend id와 일치하는 데이터를 삭제한다.`,
  })
  @ApiResponse({
    status: 200,
    description: '친구 삭제 성공',
    type: DeleteFriendResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: '해당 친구 ID가 존재하지 않습니다.',
    type: CantFindFriendIdErrorDto,
  })
  async deleteFriend(
    @GetUserId() userId: number,
    @Query('id') id: number,
  ): Promise<ResultWithoutDataDto> {
    try {
      await this.friendService.deleteFriend(userId, id);
      const data = {
        message: successResponseMessage.DELETE_FRIEND_SUCCESS,
      };
      return data;
    } catch (error: any) {
      throw error;
    }
  }
}
