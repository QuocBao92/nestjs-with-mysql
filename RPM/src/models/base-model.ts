/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
export class BaseModel {
  constructor(json?: any) {
    if (json) {
      Object.assign(this, json);
    }
  }
}
