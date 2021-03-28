//tslint:disable
export class IdnProblem {
    public status: number
    public title?: string
    public result: Result

    constructor(values = {}) {
        Object.assign(this, values)
    }
}

export class Result {
    public code: string;
    public message?: string;
}

export class BadRequestProblem extends IdnProblem {
    public static status: number = 400
    public static title: string = 'Bad Request'
    public static result: Result = {
        code: 'B001A9010000',
        message: 'The provided JSON message is not parseable.'
    }

}

export class MethodNotAllowedProblem extends IdnProblem {
    public status: number = 405
    public title: string = 'Method Not Allowed'
    public result: Result = {
        code: 'B001A9020000',
        message: 'The requested method is not allowed over this resource'
    }

}

export class UnsupportedProblem extends IdnProblem {
    public status: number = 415
    public title: string = 'Unsupported Media Type'
    public result: Result = {
        code: 'B001A9030000',
        message: 'Generic error - The request entity has a media type which the server or resource does not support.'
    }
}

export class PayloadProblem extends IdnProblem {
    public status: number = 413
    public title: string = 'Payload Too Large'
    public result: Result = {
        code: 'B001A9040000',
        message: 'Request entity too large.'
    }
}

export class UnauthorizedProblem extends IdnProblem {
    public status: number = 401
    public title: string = 'Unauthorized'
    public result: Result = {
        code: 'B001A9050000',
        message: 'SessionID certification failed.'
    }
}

export class ForbiddenProblem extends IdnProblem {
    public status: number = 403
    public title: string = 'Forbidden'
    public result: Result = {
        code: 'B001A9070000',
        message: 'SessionID has expired.'
    }
}

export class AuthFailedProblem extends IdnProblem {
    public status: number = 403
    public title: string = 'Forbidden'
    public result: Result = {
        code: 'B001A9050000',
        message: 'Auth failed.'
    }
}

export class AccessProblem extends IdnProblem {
    public status: number = 403
    public title: string = 'Forbidden'
    public result: Result = {
        code: 'B001A9060000',
        message: 'No access right.'
    }
}


export class ServerProblem extends IdnProblem {
    public status: number = 500
    public title: string = 'Internal Server Error'
    public result: Result = {
        code: 'A001A9990000',
        message: 'Internal server error.'
    }
}

