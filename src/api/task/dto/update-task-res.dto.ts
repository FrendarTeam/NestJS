import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method PUT
 * @route /task
 * @description 일정 수정
 */
export class UpdateTaskResponseDto extends ResponseDto {
  @ApiProperty({
    example: successResponseMessage.UPDATE_TASK_SUCCESS,
  })
  message: string;
}
