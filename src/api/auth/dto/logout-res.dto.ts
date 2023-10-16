import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

export class LogoutResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.LOGOUT_SUCCESS })
  message: string;
}
