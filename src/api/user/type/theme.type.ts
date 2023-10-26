export const UserThemeType = {
  WHITE: 'white',
  BLACK: 'black',
} as const;

export type UserThemeTypeValues =
  (typeof UserThemeType)[keyof typeof UserThemeType];

export const UserThemeTypeArray = Object.values(UserThemeType);
