import { USERS_MESSAGE } from './../constants/message'
import HTTP_STATUS from '~/constants/httpStatus'

type ErrorType = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
> // {[key:string]:string}

export class ErrorWithStatus {
  message: string
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  errors: ErrorType

  constructor({ message = USERS_MESSAGE.VALIDATION_ERROR, errors }: { message?: string; errors: ErrorType }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}
