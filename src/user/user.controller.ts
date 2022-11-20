import {
  Controller,
  HttpCode,
  Patch,
  UsePipes,
  Request,
  ValidationPipe,
  UseGuards,
  Body,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SocialInfoDto, UpdateUserDto } from 'src/dto/user/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Query('type') type: string,
    @Request() req: Request,
  ) {
    // type: [title, name, profile_image, social_info]
    const { id } = req['user'];
    try {
      let data: any = '';
      let updateData: object = {};

      switch (type) {
        case 'social_info':
          const socialInfoDto: SocialInfoDto = {
            social_info_email: updateUserDto.social_info_email || null,
            social_info_github: updateUserDto.social_info_github || null,
            social_info_twitter: updateUserDto.social_info_twitter || null,
            social_info_facebook: updateUserDto.social_info_facebook || null,
            social_info_url: updateUserDto.social_info_url || null,
          };

          data = await this.userService.updateSociaInfo(id, socialInfoDto);

          break;

        case 'title':
          if (!updateUserDto.title) {
            throw new Error('title must be entered');
          }
          updateData = { title: updateUserDto.title };
          data = await this.userService.updateUser(id, updateData);
          break;

        case 'name':
          if (!updateUserDto.name) {
            throw new Error('name must be entered');
          }
          updateData = {
            name: updateUserDto.name,
            about_me: updateUserDto.about_me,
          };
          data = await this.userService.updateUser(id, updateData);
          break;

        case 'profile_image':
          updateData = { profile_image: updateUserDto.profile_image };
          data = await this.userService.updateUser(id, updateData);
          break;

        case 'alert':
          updateData = {
            comment_alert: updateUserDto.comment_alert,
            update_alert: updateUserDto.update_alert,
          };
          data = await this.userService.updateUser(id, updateData);
          break;
      }

      return { message: 'update user success', data: data };
    } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        console.log(err);
        throw new ForbiddenException(
          '유저 정보가 없습니다. 토큰을 확인해주세요.',
        );
      } else if (
        err.message === 'title must be entered' ||
        err.message === 'name must be entered'
      ) {
        console.log(err);
        throw new BadRequestException(err.message);
      } else {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }

  @Patch('/profile_image')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async udpateProfileImage(
    @Body('profile_image') profile_image: string,
    @Request() req: Request,
  ) {
    const { id } = req['user'];
    try {
      const data = await this.userService.updateProfileImage(
        id,
        profile_image || null,
      );
      return { message: 'update profile image success', data: data };
    } catch (err) {
      if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        console.log(err);
        throw new ForbiddenException(
          '유저 정보가 없습니다. 토큰을 확인해주세요.',
        );
      } else {
        console.log(err);
        throw new InternalServerErrorException();
      }
    }
  }
}
