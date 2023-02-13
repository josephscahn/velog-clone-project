import { Controller, Get, HttpStatus } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get('')
  healthCheck() {
    console.log('healthCheck >>>>>>>>>>>>>>>>>>');
    return HttpStatus.OK;
  }
}
