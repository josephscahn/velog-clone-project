import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entity/user.entity';

export const ValidateToken = createParamDecorator(
  (data, ctx: ExecutionContext): User => {
    const bearerToken = ctx.switchToHttp().getRequest()['rawHeaders'][1];
    if (bearerToken.includes('Bearer')) {
      const token = bearerToken.replace('Bearer ', '');
      const user = jwt.verify(token, process.env.SECRET_KEY)['user'];

      return user;
    }
    return null;
  },
);
