import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ConflictException,
  GoneException,
  HttpException,
  NotFoundException,
  PayloadTooLargeException
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { PrismaErrorCodesEnum } from './prisma-error-codes.enum';
import { EnumValues } from 'enum-values';
import {
  // PrismaClientValidationError,
  PrismaClientKnownRequestError as PrismaError,
} from '@prisma/client/runtime/library';

@Catch()
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (this.isPrismaException(exception)) {
      super.catch(this.parsePrismaError(exception), host);
    }else if (exception instanceof PayloadTooLargeException) {
     super.catch(new BadRequestException('File upload failed, file size should be less than 5 MB'), host);    
    }
    else {
      super.catch(exception, host);
    }
  }

  protected isPrismaException = (err: unknown): err is PrismaError =>
    err instanceof PrismaError;

  protected parsePrismaError = (error: PrismaError): HttpException => {
    const exceptionArguments = [
      {
        type: 'DATABASE_ERROR',
        name: EnumValues.getNameFromValue(PrismaErrorCodesEnum, error.code),
        code: error.code,
        message: error.message,
        meta: error.meta,
      },
      error.message,
    ];

    switch (error.code) {
      case PrismaErrorCodesEnum.RecordNotFound:
      case PrismaErrorCodesEnum.ConnectedRecordsNotFound:
      case PrismaErrorCodesEnum.RelatedRecordNotFound:
        return new NotFoundException(...exceptionArguments);
      case PrismaErrorCodesEnum.InputValueTooLong:
      case PrismaErrorCodesEnum.StoredValueIsInvalid:
      case PrismaErrorCodesEnum.TypeMismatch:
      case PrismaErrorCodesEnum.TypeMismatchInvalidCustomType:
        return new BadRequestException(...exceptionArguments);
      case PrismaErrorCodesEnum.UniqueKeyViolation:
      case PrismaErrorCodesEnum.ForeignKeyViolation:
      case PrismaErrorCodesEnum.ConstraintViolation:
      case PrismaErrorCodesEnum.NullConstraintViolation:
      case PrismaErrorCodesEnum.RelationViolation:
        return new ConflictException(...exceptionArguments);
      case PrismaErrorCodesEnum.TableDoesNotExist:
      case PrismaErrorCodesEnum.ColumnDoesNotExist:
        return new GoneException(...exceptionArguments);
      default:
        return new BadRequestException(...exceptionArguments);
    }
  };
}
