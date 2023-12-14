import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

/**
 * @method PUT
 * @route /task
 * @description 일정 수정
 */
export class UpdateTaskRequestDto {
  @ApiProperty({
    example: 1,
    description: '일정의 id',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: '프랜더 회식',
    description: '일정의 제목',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    example: '강남역 1번 출구',
    description: '일정의 장소',
  })
  @IsOptional()
  @IsString()
  location: string;

  @ApiProperty({
    example: '2023-11-22T22:30:00',
    description: '일정의 시작시각',
  })
  @IsOptional()
  @IsDateString()
  startTime: string;

  @ApiProperty({
    example: '2023-11-22T23:00:00',
    description: '일정의 종료시각',
  })
  @IsOptional()
  @IsDateString()
  endTime: string;

  @ApiProperty({
    example: '[1,5]',
    description: '일정의 참석자들의 userId를 담은 배열',
  })
  @IsOptional()
  @IsArray()
  participants: number[];

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
