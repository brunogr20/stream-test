import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Catch,
} from '@nestjs/common';

import Logger from '../../common/helpers/logger.helper';
import { defaultHttpErrors } from './constants.filter';

@Catch(HttpException)
export class HTTPExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const dataError = {
      requestId: request.id,
      path: request.path,
      statusCode: 500,
      message: ['Internal server error'],
      error: 'Internal server error',
    };
    let messageLog;
    const context = host.switchToHttp();

    const response = context.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status !== 500) {
      const errorResponse =
        exception instanceof HttpException
          ? exception.getResponse()
          : exception;

      if (defaultHttpErrors[status])
        dataError.error = defaultHttpErrors[status];

      if (typeof errorResponse === 'string') {
        dataError.message = [errorResponse];
      } else {
        dataError.message = errorResponse['message'];
        if (errorResponse['statusCode']) {
          dataError.statusCode = errorResponse['statusCode'];
        } else if (errorResponse['response']) {
          const dataResponse = errorResponse['response'];
          dataError.statusCode = dataResponse['status'];
        }
      }
      messageLog = dataError;
    } else {
      messageLog = exception?.message || exception;
      dataError.message.push(messageLog);
    }

    Logger.error(messageLog);
    response.status(status).json(dataError);
  }
}
