import { ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/common/constants/response.dto';
import { errorResponseMessage } from 'src/common/constants/responseMessage';

export class InvalidDateErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.INVALID_DATE_ERROR })
  message: string;
}

export class CantFindFriendIdErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.CANT_FIND_FRIEND_ID })
  message: string;
}

export class CantFindTaskIdErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.CANT_FIND_TASK_ID })
  message: string;
}

export class CantFindUserIdErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.CANT_FIND_USER_ID })
  message: string;
}
