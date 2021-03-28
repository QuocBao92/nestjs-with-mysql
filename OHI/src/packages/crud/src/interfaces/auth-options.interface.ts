import { ObjectLiteral } from '../../../util/src';

export interface AuthGlobalOptions {
  property?: string;
}

export interface AuthOptions {
  property?: string;
  filter?: (req: any) => ObjectLiteral;
  persist?: (req: any) => ObjectLiteral;
}
