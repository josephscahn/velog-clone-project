import { Controller, UseGuards, Get, Patch, Param, Body } from '@nestjs/common';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { ValidateToken } from 'src/custom-decorator/validate-token.decorator';
import { AboutBlogDto } from 'src/dto/user/about-blog.dto';
import { User } from 'src/entity/user.entity';
import { AboutService } from './about.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get('/:user_id')
  async getAbout(@Param('user_id') user_id: number, @ValidateToken() user?: User) {
    const result = await this.aboutService.getAboutBlog(user_id, user);

    const response = SetResponse('소개글', ResponseMessage.READ_SUCCESS);

    return { statusCode: response[0], message: response[1], about: result };
  }

  @Patch('')
  @UseGuards(JwtAuthGuard)
  async editAboutBlog(@Body() data: AboutBlogDto, @GetUser() user: User) {
    const result = await this.aboutService.editAboutBlog(data.about_blog, user);

    const response = SetResponse('소개글', ResponseMessage.UPDATE_SUCCESS);

    return { statusCode: response[0], message: response[1], about: result };
  }
}
