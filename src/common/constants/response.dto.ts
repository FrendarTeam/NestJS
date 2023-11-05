import { ApiProperty } from '@nestjs/swagger';
import { errorResponseMessage } from './responseMessage';

export class ErrorDto {
  @ApiProperty({ example: 'error', description: '상태' })
  status: string;

  @ApiProperty({ example: '존재하지 않는 고객입니다', description: '메세지' })
  message: string;
}

export class ResponseDto {
  @ApiProperty({ example: 'success', description: '상태' })
  status: string;

  @ApiProperty({ example: '카카오 로그인 성공', description: '메세지' })
  message: string;
}

export class ResultWithoutDataDto {
  @ApiProperty({ example: '카카오 로그인 성공', description: '메세지' })
  message: string;
}

export class NullValueErrorDto extends ErrorDto {
  @ApiProperty({ example: errorResponseMessage.NULL_VALUE })
  message: string;
}
