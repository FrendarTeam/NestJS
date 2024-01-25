import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from 'src/common/constants/response.dto';
import { successResponseMessage } from 'src/common/constants/responseMessage';

/**
 * @method GET
 * @route /task/detail?id=?userId=
 * @description 상세 일정 조회
 */
export class ParticipantDetailDto {
  @ApiProperty({ example: 1, description: '유저의 id' })
  userId: number;

  @ApiProperty({ example: 'sumin', description: '유저의 닉네임' })
  nickname: string;

  @ApiProperty({
    example: 'https://www.profileUrl.com',
    description: '유저의 프로필 url',
  })
  profileUrl: string;
}

export class TaskDetailDto {
  @ApiProperty({ example: 1, description: '일정의 id' })
  id: number;

  @ApiProperty({
    example: '프랜더 회식',
    description: '일정의 제목',
  })
  title: string;

  @ApiProperty({
    example: '강남역 1번 출구',
    description: '일정의 장소',
  })
  location: string;

  @ApiProperty({
    example: '2023-11-22T22:30:00',
    description: '일정의 시작시각',
  })
  startTime: Date;

  @ApiProperty({
    example: '2023-11-22T23:00:00',
    description: '일정의 종료시각',
  })
  endTime: Date;

  @ApiProperty({ example: 1, description: '일정의 호스트 유저 id' })
  hostId: number;

  @ApiProperty({
    type: [ParticipantDetailDto],
    description: '일정의 참석자들의 정보를 담은 배열',
  })
  participants: ParticipantDetailDto[];

  @ApiProperty({
    example: 'yellow',
    description: '일정의 색깔',
  })
  color: string;

  @ApiProperty({
    example: true,
    description: '일정의 공개여부',
  })
  isPrivate: boolean;
}

export class GetTaskDetailResultDto {
  @ApiProperty({ type: TaskDetailDto })
  task: TaskDetailDto;
}

export class GetTaskDetailResponseDto extends ResponseDto {
  @ApiProperty({ example: successResponseMessage.GET_TASK_DETAIL_SUCCESS })
  message: string;

  @ApiProperty({ type: GetTaskDetailResultDto })
  data: GetTaskDetailResultDto;
}
