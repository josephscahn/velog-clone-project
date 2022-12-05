import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '';
    let code = 'HttpException';

    switch (exception.constructor) {
      case QueryFailedError:
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        message = (exception as QueryFailedError).message;
        code = (exception as any).code;
        break;
      case BadRequestException:
        status = (exception as any).response.statusCode;
        message = (exception as any).response.message;
        break;
      case UnauthorizedException:
        status = (exception as any).response.statusCode;
        message = (exception as any).response.message;
        break;
      case NotFoundException:
        status = (exception as any).response.statusCode;
        message = (exception as any).response.message;
        break;
      case ConflictException:
        status = (exception as any).response.statusCode;
        message = (exception as any).response.message;
        break;

      default:
        status = HttpStatus.INTERNAL_SERVER_ERROR;
    }
    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
