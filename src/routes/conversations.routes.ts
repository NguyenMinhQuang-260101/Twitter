import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversations.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const conversationRouter = Router()

/**
 * Description: Get all conversations
 * Path: /
 * Method: GET
 * Header: {Authorization: Bearer <access_token>}
 */
conversationRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  getConversationsController
)

export default conversationRouter
