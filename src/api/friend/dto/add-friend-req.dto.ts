import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

/**
 * @method POST
 * @route /friend
 * @description 친구 추가
 */
export class AddFriendRequestDto {
  @ApiProperty({
    example: '4x9px4',
    description: '유저의 친구 코드',
  })
  @IsString()
  code: string;
}
