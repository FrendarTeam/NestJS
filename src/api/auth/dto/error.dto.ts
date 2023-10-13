import { ApiProperty } from '@nestjs/swagger';
import { ErrorDto } from 'src/common/constants/response.dto';
import { errorResponseMessage } from 'src/common/constants/responseMessage';

export class InvalidTokenErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.INVALID_TOKEN })
  message: string;
}
