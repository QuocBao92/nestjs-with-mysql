/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
// Load the AWS SDK for Node.js
import * as Winston from 'winston';
import * as _ from 'lodash';
import * as crypto from 'crypto';
import * as moment from 'moment';
import { IncomingMessage } from 'http';
import { Request } from 'express';
import { isNullOrUndefined } from 'util';
import { Problem } from '../problem';
import { LogLevel } from '../enums';
import * as Constants from '../constants';

export class Logger {

    private constructor() { }

    /**
     * log fatal
     * @param message string
     * @param entryName EntryName | string
     * @param req Request | object
     * @param res object
     * @param elapsedStart number
     */
    public static fatal(message?: string, entryName?: any | string, req?: Request | object, res?: object, elapsedStart?: number) {
        const currentTime = new Date().getTime();
        const elapsedTime = elapsedStart ? currentTime - elapsedStart : undefined;
        const m = this.generateLog(LogLevel.FATAL, message, entryName, req, res, elapsedTime);
        // tslint:disable-next-line:no-console
        console.log(m);
    }

    /**
     * log error
     * @param message string
     * @param entryName EntryName | string
     * @param req Request | object
     * @param res object
     * @param elapsedStart number
     */
    public static error(message?: string, entryName?: any | string, req?: Request | object, res?: object, elapsedStart?: number) {
        const currentTime = new Date().getTime();
        const elapsedTime = elapsedStart ? currentTime - elapsedStart : undefined;
        const m = this.generateLog(LogLevel.ERROR, message, entryName, req, res, elapsedTime);
        // tslint:disable-next-line:no-console
        console.log(m);
    }

    /**
     * log warn
     * @param message string
     * @param entryName EntryName | string
     * @param req Request | object
     * @param res object
     * @param elapsedStart number
     */
    public static warn(message?: string, entryName?: any | string, req?: Request | object, res?: object, elapsedStart?: number) {
        const currentTime = new Date().getTime();
        const elapsedTime = elapsedStart ? currentTime - elapsedStart : undefined;
        const m = this.generateLog(LogLevel.WARN, message, entryName, req, res, elapsedTime);
        // tslint:disable-next-line:no-console
        console.log(m);
    }

    /**
     * log info
     * @param message string
     * @param entryName EntryName | string
     * @param req Request | object
     * @param res object
     * @param elapsedStart number
     */
    public static info(message?: string, entryName?: any | string, req?: Request | object, res?: object, elapsedStart?: number) {
        const currentTime = new Date().getTime();
        const elapsedTime = elapsedStart ? currentTime - elapsedStart : undefined;
        const m = this.generateLog(LogLevel.INFO, message, entryName, req, res, elapsedTime);
        // tslint:disable-next-line:no-console
        console.log(m);
    }

    /**
     * log debug
     * @param message string
     * @param entryName EntryName | string
     * @param req Request | object
     * @param res object
     * @param elapsedStart number
     */
    public static debug(message?: string, entryName?: any | string, req?: Request | object, res?: object, elapsedStart?: number) {
        const currentTime = new Date().getTime();
        const elapsedTime = elapsedStart ? currentTime - elapsedStart : undefined;
        const m = this.generateLog(LogLevel.DEBUG, message, entryName, req, res, elapsedTime);
        if (process.env.LOGGER_LOG_LEVEL?.toUpperCase() === LogLevel.DEBUG) {
            // tslint:disable-next-line:no-console
            console.log(m);
        }
    }

    /**
     *  generate log message
     * @param level LogLevel
     * @param message string
     * @param entryName EntryName | string
     * @param req Request | object
     * @param res object
     * @param elapsedTime number
     */
    public static generateLog(level: LogLevel, message?: string, entryName?: any | string, req?: Request | object, res?: object, elapsedTime?: number,
    ) {
        try {

            // time with prefix
            const strTime = `time:[${moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')}]`;

            // level with prefix
            const strLevel = `level:[${level}]`;

            // message name with prefix
            const strMessage = message && message !== '' && `[${message}]`;

            // entry name with prefix
            const strEntryName = entryName && `entryName:[${entryName}]`;

            // elapsedTime with prefix
            const strRequest = `${this.generateRequest(req)}`;
            const cloneDeep = _.cloneDeep(res);
            const encryptValues = this.encryptValues(cloneDeep);
            const strResponse = res && `[RESPONSE]:${JSON.stringify(encryptValues)}`;
            const strElapsedTime = !isNullOrUndefined(elapsedTime) && `elapsedTime:[${elapsedTime}]` || ``;

            const strElapsed = [strRequest, strResponse, strElapsedTime]
                // Filter array strElapsed by each element != null or != undefined
                .filter(str => !isNullOrUndefined(str))
                // Convert the elements of an array into a string
                .join(',')
                // The replace() method searches a string with a regular expression returns values are replaced.
                .replace(/,\s*$/, '');

            if (strEntryName.includes('batch')) {
                // log message
                return [strTime, strLevel, strEntryName, strMessage, strElapsed]
                    // Filter array strElapsed by each element != null or != undefined
                    .filter(str => !isNullOrUndefined(str))
                    // Convert the elements of an array into a string
                    .join(',')
                    // The replace() method searches a string with a regular expression returns values are replaced.
                    .replace(/,,/g, ',')
                    .replace(/,\s*$/, '');
            } else {
                return [strTime, strLevel, strMessage, strEntryName, strElapsed]
                    // Filter array strElapsed by each element != null or != undefined
                    .filter(str => !isNullOrUndefined(str))
                    // Convert the elements of an array into a string
                    .join(',')
                    // The replace() method searches a string with a regular expression returns values are replaced.
                    .replace(/,,/g, ',')
                    .replace(/,\s*$/, '');
            }
        } catch (ex) {
            throw ex;
        }
    }

    /**
     * generate request params with prefix
     * @param req Request | object
     */
    public static generateRequest(req: Request | object): string {
        try {
            if (!req) {
                // Check if not req
                return '';
            }
            const objReq = { ...req };
            if (req instanceof IncomingMessage) {
                const request = objReq as Request;
                // request.parameter
                const params = request.params && Object.keys(request.params).length !== 0
                    ? `params:${JSON.stringify(this.encryptValues(request.params))}` : '';
                // request.query
                // Remove common fields no need log: [elapsedStart]
                if (request.query && Object.keys(request.query).length > 0 && request.query.elapsedStart) {
                    delete request.query.elapsedStart;
                }
                const query = request.query && Object.keys(request.query).length !== 0
                    ? `query:${JSON.stringify(this.encryptValues(request.query))}` : '';
                // request.body
                const body = request.body && Object.keys(request.body).length !== 0
                    ? `body:${JSON.stringify(this.encryptValues(request.body))}` : '';

                const strRequest = `${params}${query}${body}`;
                return strRequest.length > 0 ? `[REQUEST]:${strRequest}` : '';
            } else
                if (typeof req === 'object') {
                    // Check req has equal type object
                    return `[REQUEST]:${JSON.stringify(this.encryptValues(objReq))}`;
                }
        } catch (ex) {
            throw ex;
        }

    }

    /**
     * encrypt values
     * @param data any
     * @param k key of object
     */
    public static encryptValues(data: any, k?: string, parentsKey?: string[]) {
        if (parentsKey === undefined) {
            parentsKey = [];
        }
        if (k) {
            parentsKey.push(k);
        }

        /**
         * LOGGER_ENC=true  : Encryption On
         * LOGGER_ENC=false : Encryption Off
         */
        if (process.env.LOGGER_ENC !== 'true') {
            return data;
        }
        if (isNullOrUndefined(data)) {
            // Check if data null or undefined
            return data;
        }
        if (typeof data === 'string' || typeof data === 'number') {
            // Check data has equal type string or data equal type number
            // if (k && arrEncryption.indexOf(k) > -1 ||
            //     arrEncryption.filter(field => data.toString().includes(field))?.length > 0) {
            // Check k and (arrEncryption) of index of greater than -1 or filter data of (arrEncryption) has length greater than 0
            return this.encrypt(data);
            // }
        }

        if (data instanceof Problem || (typeof data === 'object' && !Array.isArray(data))) {
            // Check data has equal type object and not type Array
            const keys = Object.keys(data);
            const parentLength = parentsKey.length;
            let lastParent = '';
            if (parentLength > 0) {
                lastParent = parentsKey[parentLength - 1];
            }
            keys.forEach(key => {
                const sdata = data[key];
                if (typeof sdata === 'string' || typeof sdata === 'number') {
                    // Check sdata has equal type string or sdata has equal type number
                    // if (arrEncryption.indexOf(key) > -1 ||
                    //     arrEncryption.filter(field => sdata.toString().includes(field))?.length > 0) {
                    // Check k and (arrEncryption) of index of greater than -1 or filter data of (arrEncryption) has length greater than 0

                    // The key combination existing in Constants.KEY_WITHOUT_ENCRYPTION is output to the log without being encrypted.
                    // default encCheck:1(with encryption)
                    let encCheck = 1;
                    Constants.KEY_WITHOUT_ENCRYPTION.forEach(checkKey => {
                        if (lastParent === checkKey[0]) {
                            if (typeof checkKey[1] === 'string' && key === checkKey[1]) {
                                encCheck = 0;
                            } else if (Array.isArray(checkKey[1])) {
                                checkKey[1].forEach(childKey => {
                                    if (typeof childKey === 'string' && key === childKey) {
                                        encCheck = 0;
                                    }
                                });
                            }
                        }
                    });

                    if (encCheck === 0) {
                        // without encryption
                        data[key] = sdata;
                    } else {
                        // with encryption
                        data[key] = this.encrypt(sdata);
                    }
                    // }
                } else {
                    // data[key] has encrypt values
                    data[key] = this.encryptValues(sdata, key, parentsKey);
                }
            });
            return data;
        }
        if (Array.isArray(data)) {
            // Check data has type Array
            data = data.map(obj => {
                return this.encryptValues(obj, k, parentsKey);
            });
            return data;
        }

    }

    /**
     * encrypt use
     * @param val
     */
    public static encrypt(val) {
        try {
            const ENC_KEY = process.env.LOGGER_ENC_KEY;
            const IV = process.env.LOGGER_IV;
            const LOGGER_IV_MODE = process.env.LOGGER_IV_MODE;
            // Creates and returns a Cipher object, with the given algorithm, key and initialization vector (iv).
            const cipher: crypto.Cipher = crypto.createCipheriv(LOGGER_IV_MODE, ENC_KEY, IV);
            // The cipher.update() method can be called multiple times with new data until cipher.final() is called
            let encrypted: string = cipher.update(val.toString(), 'utf8', 'base64');
            encrypted += cipher.final('base64');
            return encrypted;
        } catch (err) {
            return Constants.ENCRYPTION_FAILED;
        }
    }

    /**
     * decrypt use
     * @param encrypted
     */
    public static decrypt(encrypted) {
        try {
            const ENC_KEY = process.env.LOGGER_ENC_KEY;
            const IV = process.env.LOGGER_IV;
            const LOGGER_IV_MODE = process.env.LOGGER_IV_MODE;
            // Creates and returns a Decipher object that uses the given algorithm and password (ENC_KEY).
            const decipher = crypto.createDecipheriv(LOGGER_IV_MODE, ENC_KEY, IV);
            // The cipher.update() method can be called multiple times with new data until cipher.final() is called
            const decrypted = decipher.update(encrypted, 'base64', 'utf8');
            return (decrypted + decipher.final('utf8'));
        } catch (err) {
            throw err;
        }
    }

}
