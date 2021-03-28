/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { ClassificationCode, CodeType, ErrorType, ProblemException, ProcessingType, ResponseProblemException } from '../common';

@Injectable()
export class ForesightMiddleware implements NestMiddleware {

    /**
     * use
     * @param req any
     * @param res any
     * @param next void
     */
    async use(req: any, res: any, next: () => void) {

        req.query.elapsedStart = new Date().getTime();
        if (req.headers['content-type'] !== 'application/json') {
            const problem = new ProblemException({
                status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                errorType: ErrorType.B,
                code: CodeType.AtTheError,
                processingType: ProcessingType.APIForOHI,
                classificationCode: ClassificationCode.ContentsIsIllegal,
                message: 'Generic error - The request entity has a media type which the server or resource does not support.',
            });
            throw new ResponseProblemException(req, problem);

        } else {
            next();
        }
    }
}
