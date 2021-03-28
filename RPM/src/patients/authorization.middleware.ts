/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { NestMiddleware, Injectable, Inject, HttpStatus } from '@nestjs/common';
import { SsoService } from '../sso/sso.service';
import {
  ProblemException,
  ResponseProblemException,
  ProcessingType,
  ErrorType,
  ClassificationCode,
  CodeType,
  RpmLogger,
} from '../common';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  constructor(@Inject('SsoService') private service: SsoService) { }

  /**
   * use
   * @param req any
   * @param res any
   * @param next void
   */
  async use(req: any, res: any, next: () => void) {
    req.query.elapsedStart = new Date().getTime();
    if (req.headers['content-type'] !== 'application/json' && req.headers['content-type'] !== 'application/json; charset=utf-8') {
      const result = new ProblemException({
        status: HttpStatus.UNSUPPORTED_MEDIA_TYPE,
        errorType: ErrorType.B,
        code: CodeType.AtTheError,
        processingType: ProcessingType.APIforDoctorDashboard,
        classificationCode: ClassificationCode.ContentsIsIllegal,
        message: 'Generic error - The request entity has a media type which the server or resource does not support.',
      });
      RpmLogger.info(req, result);
      throw new ResponseProblemException(req, result);
    }

    const isValid = await this.service.validateRequest(req);
    if (isValid instanceof ProblemException) {
      throw new ResponseProblemException(req, isValid);
    }
    next();
  }
}
