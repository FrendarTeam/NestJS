import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method POST
 * @route /task
 * @description 일정 추가
 */
export class AddTaskResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.ADD_TASK_SUCCESS,
  })
  message: string;
}

export class UserTaskValueDto {
  @ApiProperty({
    example: 1,
    description: '일정의 id',
  })
  taskId: number;

  @ApiProperty({
    example: 1,
    description: '유저의 id',
  })
  userId: number;

  @ApiProperty({
    example: 'yellow',
    description: '일정의 색깔',
  })
  color: string;

  @ApiProperty({
    example: true,
    description: '일정의 공개여부',
  })
  isPrivate: boolean;
}
