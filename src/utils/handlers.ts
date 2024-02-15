import { NextFunction, Request, Response, RequestHandler } from 'express'

export const wrapRequestHandler = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    // Promise.resolve(func(req, res, next)).catch(next)
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}

// Mong muốn nhận vào là: Request<{username:string}>
// Thực nhận là: Request<{[key:string]: string}>
