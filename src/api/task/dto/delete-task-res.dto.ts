import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method DELETE
 * @route /task?id=
 * @description 일정 삭제
 */
export class DeleteTaskResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.DELETE_TASK_SUCCESS,
  })
  message: string;
}
