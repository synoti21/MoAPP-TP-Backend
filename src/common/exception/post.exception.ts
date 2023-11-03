import { ResponseCode } from '../api';
import { BaseException } from './base.exeception';

export class PostException extends BaseException {
  constructor(responseCode: ResponseCode) {
    super(responseCode);
  }
}
