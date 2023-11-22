import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsDateString, IsString } from 'class-validator';

/**
 * @method POST
 * @route /task
 * @description 일정 추가
 */
export class AddTaskRequestDto {
  @ApiProperty({
    example: '프랜더 회식',
    description: '일정의 제목',
  })
  @IsString()
  title: string;

  @ApiProperty({
    example: '강남역 1번 출구',
    description: '일정의 장소',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: '2023-11-22T22:30:00',
    description: '일정의 시작시각',
  })
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2023-11-22T23:00:00',
    description: '일정의 종료시각',
  })
  @IsDateString()
  endTime: string;

  @ApiProperty({
    example: '[1,5]',
    description: '일정의 참석자들의 friendId를 담은 배열',
  })
  @IsArray()
  friendIds: number[];

  @ApiProperty({
    example: 'yellow',
    description: '일정의 색깔',
  })
  @IsString()
  color: string;

  @ApiProperty({
    example: true,
    description: '일정의 공개여부',
  })
  @IsBoolean()
  isPrivate: boolean;
}
