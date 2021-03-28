import axios from 'axios';
import { Problem, InternalServerProblem } from './problem';

export class Requester {

  public static async post<T>(url: string, data: T, config?: any): Promise<T | Problem> {
    try {
      const response = await axios.post<T>(`${url}`, data, config)

      if (response.status !== 200) {
        return new InternalServerProblem({
          detail: `Could not post (error: ${response.statusText})`
        })
      }
      return response.data
    } catch (e) {
      return new InternalServerProblem({
        detail: e
      })
    }
  }

  public static async get<T>(url: string): Promise<T | Problem> {
    try {
      // TODO:: add header here
      const response = await axios.get<T>(`${url}`);

      if (response.status !== 200) {
        return new InternalServerProblem({
          detail: `Could not get (error: ${response.statusText})`,
        });
      }
      return response.data;
    } catch (e) {
      return new InternalServerProblem({
        detail: e
      })
    }
  }

  public static async put<T>(url: string, data: T): Promise<T | Problem> {
    try {
      const response = await axios.put<T>(`${url}`, data)

      if (response.status !== 200) {
        return new InternalServerProblem({
          detail: `Could not edit (error: ${response.statusText})`
        })
      }
      return response.data
    } catch (e) {
      return new InternalServerProblem({
        detail: e
      })
    }
  }

  public static async delete<T>(url: string, data: any): Promise<T | Problem> {
    try {
      const response = await axios.delete<T>(`${url}`)

      if (response.status !== 200) {
        return new InternalServerProblem({
          detail: `Could not delete (error: ${response.statusText})`
        })
      }
      return response.data
    } catch (e) {
      return new InternalServerProblem({
        detail: e
      })
    }
  }
}