export const successResponseMessage = {
  /**
   * Auth
   */
  KAKAO_LOGIN_SUCCESS: '카카오 로그인 성공',
  LOGOUT_SUCCESS: '로그아웃 성공',
  REISSUE_ACCESS_TOKEN_SUCCESS: '액세스 토큰 재발행 성공',

  /**
   * User
   */
  GET_USER_INFO_SUCCESS: '유저 정보 조회 성공',
  UPDATE_USER_INFO_SUCCESS: '유저 정보 수정 성공',
  NOTIFICATION_TOGGLE_ON_SUCCESS: '알림 허용',
  NOTIFICATION_TOGGLE_OFF_SUCCESS: '알림 거부',
  UPDATE_USER_THEME_SUCCESS: '메인 테마 변경 성공',

  /**
   * Friend
   */
  ADD_FRIEND_SUCCESS: '친구 추가 성공',
  GET_LIST_OF_FRIEND_SUCCESS: '친구 목록 조회 성공',
  DELETE_FRIEND_SUCCESS: '친구 삭제 성공',

  /**
   * Task
   */
  ADD_TASK_SUCCESS: '일정 추가 성공',
  DELETE_TASK_SUCCESS: '일정 삭제 성공',
};

export const errorResponseMessage = {
  /**
   * Common
   */
  NULL_VALUE: 'Request Body에 필요한 값이 없습니다.',

  /**
   * Auth
   */
  INVALID_TOKEN: '토큰이 유효하지 않습니다.',
  EXPIRED_TOKEN: '토큰이 만료되었습니다.',
  NEED_TO_AUTHENTICATION: '로그인이 필요합니다',

  /**
   * User
   */
  INVALID_IMAGE_FILE: '지원하지 않는 이미지 형식입니다.',

  /**
   * Friend
   */
  INVALID_FRIEND_CODE: '친구 코드가 유효하지 않습니다.',
  ALREADY_ADDED_FRIEND: '이미 추가한 친구입니다.',
  CANT_FIND_FRIEND_ID: '해당 친구 ID가 존재하지 않습니다.',

  /**
   * Task
   */
  INVALID_DATE_ERROR: '일정의 시작시각이 종료시각보다 늦을 수 없습니다.',
  CANT_FIND_TASK_ID: '해당 일정 ID가 존재하지 않습니다.',
};
