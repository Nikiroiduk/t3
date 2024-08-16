import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { UniqueConstraintError } from 'sequelize';
  
  @Catch(UniqueConstraintError)
  export class UniqueConstraintFilter implements ExceptionFilter {
    catch(exception: UniqueConstraintError, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
  
      response.status(HttpStatus.CONFLICT).json({
        statusCode: HttpStatus.CONFLICT,
        message: 'Conflict: Some of provided values already exists.',
        error: 'Conflict',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }