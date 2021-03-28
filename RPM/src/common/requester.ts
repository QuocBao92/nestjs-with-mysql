/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
import { HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { Logger } from './cloudwatch-logs';
import { InternalServerProblem, Problem } from './problem';

export class Requester {
  constructor(private readonly logger: Logger) { }
  /**
   * method post
   * @param url string
   * @param data any
   * @param config? any
   */
  public static async post<T>(url: string, data: any, config?: any): Promise<T | Problem> {
    let response;
    try {
      response = await axios.post<T>(`${url}`, data, config);
      if (response?.status !== 200) {
        return new Problem({
          status: response?.status,
          title: response?.statusText,
          detail: response,
          data: response?.data,
        });
      } else {
        return response?.data;
      }
    } catch (e) {
      return new Problem({
        status: e.response?.status,
        data: e.response?.data,
      });
    }
  }

  /**
   * get
   * @param url string
   */
  public static async get<T>(url: string, config: any): Promise<T | Problem> {
    let response;
    try {
      // method get
      response = await axios.get<T>(`${url}`, config);
      if (response?.status !== 200) {
        // if status != 200 then return it problem InternalServerProblem
        return new InternalServerProblem({
          detail: `Could not get (error: ${response.statusText})`,
        });
      }
      // If status = 200 then return response
      return response?.data;
    } catch (e) {
      return new InternalServerProblem({
        status: response?.status,
        detail: e,
      });
    }
  }

  /**
   * Retry get request
   * @param url string
   * @param retryTimes number
   * @param retryInterval number
   * @param entryName EntryName
   * @param isAlgo? boolean
   * @param option? any
   */
  public async retryGetRequest<T>(
    url: string, retryTimes: number, retryInterval: number, entryName: any,
    isAlgo?: boolean, option?: any) {
    let elapsedStart;
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
    let retryNumber = 0;
    let obRetry;

    const headers = isAlgo ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json', 'host': process.env.OHI_HOST };
    const config = option ? { headers: option } : { headers };
    // Loop if retryNumber <= retryTimes
    while (retryNumber <= retryTimes) {
      // call api by method get
      elapsedStart = new Date().getTime();
      obRetry = await Requester.get<T>(url, config);
      if (obRetry instanceof Problem &&
        (obRetry.status === HttpStatus.REQUEST_TIMEOUT ||
          obRetry.status === HttpStatus.TOO_MANY_REQUESTS ||
          obRetry.status === HttpStatus.INTERNAL_SERVER_ERROR ||
          obRetry.status === HttpStatus.SERVICE_UNAVAILABLE ||
          obRetry.status === HttpStatus.GATEWAY_TIMEOUT)) {
        // Retry if there is an error
        retryNumber = retryNumber + 1;
        // if have retry log warn
        if (retryTimes > 0 && retryNumber <= retryTimes) {
          Logger.warn('', entryName, { url }, obRetry, elapsedStart);
        }
        if (isAlgo) {
          // if isAlgo != null call function sleep

          // First retry interval: 1 second
          // Second retry interval: 2 seconds
          // Third retry interval: 4 seconds
          // 4th retry interval: 8 seconds
          // 5th retry interval: 16 seconds
          await sleep(1000 * retryInterval * Math.pow(2, retryNumber - 1));
        } else {
          await sleep(1000 * retryInterval);
        }
      } else {
        if (obRetry instanceof Problem && (obRetry.status === HttpStatus.BAD_REQUEST || obRetry.status === HttpStatus.FORBIDDEN)) {
          Logger.error('', entryName, { url }, obRetry, elapsedStart);
        }
        return obRetry;
      }
    }
    if (retryNumber > retryTimes && obRetry instanceof Problem) {
      Logger.error('', entryName, { url }, obRetry, elapsedStart);
    }
    return obRetry;
  }

  /**
   * Retry post request
   * @param url string
   * @param body any
   * @param retryTimes number
   * @param retryInterval number
   * @param entryName EntryName
   * @param isAlgo?: boolean
   * @param option?: any
   */
  public async retryPostRequest<T>(
    url: string, body: any, retryTimes: number, retryInterval: number,
    entryName: any, isAlgo?: boolean, option?: any) {
    let elapsedStart;
    const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));
    const headers = isAlgo ? { 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json', 'host': process.env.OHI_HOST };
    const config = option ? { headers: option } : { headers };
    let retryNumber = 0;
    let obRetry;
    // Loop if retryNumber <= retryTimes
    while (retryNumber <= retryTimes) {
      elapsedStart = new Date().getTime();
      // call api by method post
      obRetry = await Requester.post<T>(url, body, config);
      if (obRetry instanceof Problem &&
        (obRetry.status === HttpStatus.REQUEST_TIMEOUT ||
          obRetry.status === HttpStatus.TOO_MANY_REQUESTS ||
          obRetry.status === HttpStatus.INTERNAL_SERVER_ERROR ||
          obRetry.status === HttpStatus.SERVICE_UNAVAILABLE ||
          obRetry.status === HttpStatus.GATEWAY_TIMEOUT)) {
        // Retry if there is an error
        retryNumber = retryNumber + 1;
        // if have retry log warn
        if (retryTimes > 0 && retryNumber <= retryTimes) {
          Logger.warn('', entryName, body, obRetry, elapsedStart);
        }

        if (isAlgo) {
          // If isAlgo != null call function sleep
          // First retry interval: 1 second
          // Second retry interval: 2 seconds
          // Third retry interval: 4 seconds
          // 4th retry interval: 8 seconds
          // 5th retry interval: 16 seconds
          await sleep(1000 * retryInterval * Math.pow(2, retryNumber - 1));
        } else {
          await sleep(1000 * retryInterval);
        }
      } else {
        if (obRetry instanceof Problem && (obRetry.status === HttpStatus.BAD_REQUEST || obRetry.status === HttpStatus.FORBIDDEN)) {
          Logger.error('', entryName, body, obRetry, elapsedStart);
        }
        return obRetry;
      }
    }
    // if retry limit and have an error
    if (retryNumber > retryTimes && obRetry instanceof Problem) {
      Logger.error('', entryName, body, obRetry, elapsedStart);
    }
    return obRetry;
  }
}
