import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

const errorMappings: Record<string, { status: number; message: string }> = {
  P2000: { status: HttpStatus.BAD_REQUEST, message: 'Input Data is too long' },
  P2001: { status: HttpStatus.NO_CONTENT, message: 'Record does not exist' },
  P2002: {
    status: HttpStatus.CONFLICT,
    message: 'Reference Data already exists',
  },
  P2003: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Foreign key constraint failed',
  },
  P2004: {
    status: HttpStatus.BAD_REQUEST,
    message: 'A unique constraint would be violated',
  },
  P1001: {
    status: HttpStatus.SERVICE_UNAVAILABLE,
    message: 'Cannot connect to the database',
  },
  P1003: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Database table not found',
  },
  P1010: {
    status: HttpStatus.BAD_REQUEST,
    message: 'Database column not found',
  },
  P1011: { status: HttpStatus.BAD_REQUEST, message: 'Unknown database type' },
};

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError,
  HttpException,
  Error,
)
export class PrismaClientExceptionFilter
  extends BaseExceptionFilter
  implements ExceptionFilter
{
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const errorCode = exception.code;
      const errorMapping = errorMappings[errorCode];

      if (errorMapping) {
        const { status, message } = errorMapping;
        response.status(status).json({
          statusCode: status,
          message: `${message} at path: ${request.url.split('/').pop()}, Error Code: ${errorCode}`,
        });
      } else {
        super.catch(
          new HttpException(
            'An unknown database error occurred',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
          host,
        );
      }
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      if (status === HttpStatus.UNAUTHORIZED) {
        response.status(HttpStatus.UNAUTHORIZED).json({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Unauthorized access',
          error: 'Unauthorized',
        });
      } else {
        super.catch(exception, host);
      }
    } else if (exception instanceof Error) {
      super.catch(
        new HttpException(exception.message, HttpStatus.INTERNAL_SERVER_ERROR),
        host,
      );
    }
  }
}
