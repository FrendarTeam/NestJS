import { ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/common/constants/response.dto';
import { errorResponseMessage } from 'src/common/constants/responseMessage';

export class InvalidFriendCodeErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.INVALID_FRIEND_CODE })
  message: string;
}

export class AlreadyAddedFriendErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.ALREADY_ADDED_FRIEND })
  message: string;
}
