export class BaseModel {
    constructor(json: any) {
      Object.assign(this, json);
    }
  }
