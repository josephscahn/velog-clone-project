import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entity/user.entity';

export const ValidateToken = createParamDecorator((_data, ctx: ExecutionContext): User | null => {
  const rawHeaders: Array<string> = ctx.switchToHttp().getRequest()['rawHeaders'];
  const auth_index = rawHeaders.findIndex(el => el === 'authorization' || el === 'Authorization');

  if (auth_index != -1) {
    const token = rawHeaders[auth_index + 1].replace('Bearer ', '');

    if (token !== 'null' && token !== 'Host') {
      let user = jwt.verify(token, process.env.SECRET_KEY)['user'];
      user = {
        id: user['sub'],
        login_id: user['login_id'],
        name: user['name'],
      };
      return user;
    }
  }

  return null;
});
