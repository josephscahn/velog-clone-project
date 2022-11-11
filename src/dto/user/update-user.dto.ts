import { PartialType, PickType } from '@nestjs/mapped-types';
import { Allow, IsBoolean, IsEmail, IsUrl } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

/**
 * profile_image, name, title, about_me, social_info_email, social_info_github, social_info_twitter, social_info_facebook, social_info_url, comment_alert, update_alert
 */
export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name', 'about_me'] as const),
) {
  @Allow()
  profile_image?: string;

  @Allow()
  title?: string;

  @IsEmail()
  social_info_email?: string;

  @Allow()
  social_info_github?: string;

  @Allow()
  social_info_twitter?: string;

  @Allow()
  social_info_facebook?: string;

  @IsUrl()
  social_info_url?: string;

  @IsBoolean()
  comment_alert?: boolean;

  @IsBoolean()
  update_alert?: boolean;
}
