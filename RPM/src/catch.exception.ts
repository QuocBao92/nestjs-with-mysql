/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { ErrorCode, ProcessingType, ErrorType, ClassificationCode } from './common';

@Catch(HttpException)
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = (exception as any).response?.message;

        const processingType = request.path.includes('foresight') ? ProcessingType.APIForOHI : ProcessingType.APIforDoctorDashboard;

        let processingNo = 0;
        if (processingType === ProcessingType.APIForOHI) {
            if (request.path.includes('unregisterUser')) {
                processingNo = 2;
            } else if (request.path.includes('registerUser')) {
                processingNo = 1;
            }
        }

        if (message?.includes('Unexpected token') || message?.includes('Unexpected string')) {

            return response.status(status).json({
                result: {
                    code: ErrorCode.generalErrorCode(request, processingType,
                        ErrorType.B, ClassificationCode.JSONFormIsIllegal, 0, processingNo),  // 'B001A9010000',
                    message: 'The provided JSON message is not parseable.',
                },
            });
        } else if (message?.includes('Cannot')) {
            return response.status(HttpStatus.METHOD_NOT_ALLOWED).json({
                result: {
                    code: ErrorCode.generalErrorCode(request, processingType, ErrorType.B,
                        ClassificationCode.MethodIsIllegal, 0, processingNo),  // 'B001A9010000',
                    message: 'The requested method is not allowed over this resource.',
                },
            });
        }

        return response.status(status).json((exception as any).message);
    }
}
