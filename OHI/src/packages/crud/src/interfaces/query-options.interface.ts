import {
  QueryFields,
  QueryFilter,
  QuerySort,
  SCondition,
} from '../../../crud-request/src/types/request-query.types';

export interface QueryOptions {
  allow?: QueryFields;
  exclude?: QueryFields;
  persist?: QueryFields;
  filter?: QueryFilter[] | SCondition;
  join?: JoinOptions;
  sort?: QuerySort[];
  limit?: number;
  maxLimit?: number;
  cache?: number | false;
}

export interface JoinOptions {
  [key: string]: JoinOption;
}

export interface JoinOption {
  allow?: QueryFields;
  exclude?: QueryFields;
  persist?: QueryFields;
  eager?: boolean;
  required?: boolean;
  alias?: string;
}
