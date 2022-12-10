import { Logger, NestMiddleware } from '@nestjs/common';

export class LoggerMiddleware implements NestMiddleware {
  public use(req: any, res: any, next: () => void) {
    Logger.log(`Request ${req.method} ${req.baseUrl}`);
    next();
  }
}
