import {
  Controller,
  HttpCode,
  Patch,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Body,
  BadRequestException,
  Query,
  Post,
  ParseIntPipe,
  Delete,
  Get,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { SocialInfoDto, UpdateUserDto } from 'src/dto/user/update-user.dto';
import { User } from 'src/entity/user.entity';
import { multerOptions } from 'src/lib/multerOptions';
import { UserService } from './user.service';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

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
    @GetUser() user: User,
  ) {
    const id = user.id;
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
          throw new BadRequestException('title이 입력되어야합니다.');
        }
        updateData = { title: updateUserDto.title };
        data = await this.userService.updateUser(id, updateData);
        break;

      case 'name':
        if (!updateUserDto.name) {
          throw new BadRequestException('name이 입력되어야합니다.');
        }
        updateData = {
          name: updateUserDto.name,
          about_me: updateUserDto.about_me,
        };
        data = await this.userService.updateUser(id, updateData);
        break;

      case 'alert':
        if (updateUserDto.comment_alert === undefined || updateUserDto.update_alert === undefined) {
          throw new BadRequestException('alert가 입력되어야합니다.');
        }
        updateData = {
          comment_alert: updateUserDto.comment_alert,
          update_alert: updateUserDto.update_alert,
        };
        data = await this.userService.updateUser(id, updateData);
        break;
    }
    const response = SetResponse('유저 정보', ResponseMessage.UPDATE_SUCCESS);
    return { statusCode: response[0], message: response[1], data: data[0] };
  }

  @Post('/profile_image')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('image', 1, multerOptions))
  @HttpCode(201)
  async updateProfileImage(
    @UploadedFiles() files: File[],
    @Query('image_url') image_url: string,
    @GetUser() user: User,
  ) {
    const id = user.id;
    const data = await this.userService.updateProfileImage(id, image_url, files[0]['filename']);
    const response = SetResponse(id + '번 유저의 프로필 이미지', ResponseMessage.UPDATE_SUCCESS);
    return {
      statusCode: response[0],
      message: response[1],
      profile_image: data[0].profile_image,
    };
  }

  @Delete('/profile_image')
  @UseGuards(JwtAuthGuard)
  async deleteProfileImage(@Query('image_url') image_url: string, @GetUser() user: User) {
    await this.userService.deleteProfileImage(user.id, image_url);
    const response = SetResponse('프로필 이미지', ResponseMessage.DELETE_SUCCESS);
    return {
      statusCode: response[0],
      message: response[1],
    };
  }

  /**
   * 1번 유저가 2번 유저를 팔로우 했다 => 1번 유저: follower, 2번 유저: followee
   * @param user
   * @param followeeId
   * @returns
   */
  @Post('/follow')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async follow(@GetUser() user: User, @Body('followee_id', ParseIntPipe) followeeId: number) {
    const followerId = user.id;
    const data = await this.userService.follow(followerId, followeeId);
    const response = SetResponse(followeeId.toString() + '번 유저', ResponseMessage.FOLLOW_SUCCESS);
    return { statusCode: response[0], message: response[1], is_follower: data };
  }

  @Delete('/follow')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async unfollow(@GetUser() user: User, @Body('followee_id', ParseIntPipe) followeeId: number) {
    const followerId = user.id;
    const data = await this.userService.unfollow(followerId, followeeId);
    const response = SetResponse(
      followeeId.toString() + '번 유저',
      ResponseMessage.UNFOLLOW_SUCCESS,
    );
    return { statusCode: response[0], message: response[1], is_follower: data };
  }

  @Get('/follow')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async getMyFollowee(@GetUser() user: User) {
    const id = user.id;
    const follow = (await this.userService.getMyFollowee(id))[0];
    const response = SetResponse('팔로워', ResponseMessage.READ_SUCCESS);
    return { statusCode: response[0], message: response[1], followee: follow };
  }

  @Get()
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser() user: User) {
    const id = user.id;
    const data = await this.userService.getMe(id);
    const response = SetResponse(id.toString() + '번 유저', ResponseMessage.READ_SUCCESS);
    return { statusCode: response[0], message: response[1], user: data };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async withdrawal(@GetUser() user: User) {
    await this.userService.withdrawal(user.id);
    const response = SetResponse(
      user.id.toString() + '번 유저 ',
      ResponseMessage.WITHDRAWAL_SUCCESS,
    );
    return { statusCode: response[0], message: response[1] };
  }
}
