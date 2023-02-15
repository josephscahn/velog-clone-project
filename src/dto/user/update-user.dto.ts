import { PickType } from '@nestjs/mapped-types';
import { Allow, IsEnum, Length } from 'class-validator';
import { IsBooleanOrNull, IsEmailOrNull, IsUrlOrNull } from 'src/validations/user.validation';

/**
 * profile_image, name, title, about_me, social_info_email, social_info_github, social_info_twitter, social_info_facebook, social_info_url, comment_alert, update_alert
 */
export class UpdateUserDto {
  @Allow()
  name?: string;

  @Allow()
  about_me?: string;

  @Allow()
  profile_image?: string;

  @Allow()
  title?: string;

  @IsEmailOrNull({ message: '이메일 형식 또는 null이 아닙니다.' })
  social_info_email?: string;

  @Allow()
  social_info_github?: string;

  @Allow()
  social_info_twitter?: string;

  @Allow()
  social_info_facebook?: string;

  @IsUrlOrNull({ message: 'URL 형식 또는 null이 아닙니다.' })
  social_info_url?: string;

  @IsBooleanOrNull({ message: '1, 0 중에 입력해주세요' })
  comment_alert?: number;

  @IsBooleanOrNull({ message: '1, 0 중에 입력해주세요' })
  update_alert?: number;
}

export class SocialInfoDto extends PickType(UpdateUserDto, [
  'social_info_email',
  'social_info_github',
  'social_info_twitter',
  'social_info_facebook',
  'social_info_url',
] as const) {}
