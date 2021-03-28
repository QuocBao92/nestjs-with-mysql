/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
export class Problem {
  public status: number;
  public type?: string;
  public title?: string;
  public detail?: string;

  constructor(values = {}) {
    Object.assign(this, values);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class InternalServerProblem extends Problem {
  public status: number = 500;
  public title: string = 'Internal server error';
}
