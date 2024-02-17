import { Request, Response, NextFunction } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/message'
import mediasService from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.handleUploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result: url
  })
}

export const serveImageController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  const isNameJpg = !name.includes('.') ? name + '.jpg' : name
  return res.sendFile(path.resolve(UPLOAD_DIR, isNameJpg), (err) => {
    if (err) {
      res.status((err as any).status).send('Not found')
    }
  })
}
