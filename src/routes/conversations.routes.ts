import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversations.controllers'
import { paginationValidator } from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, getConversationValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'

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
  paginationValidator,
  getConversationValidator,
  wrapRequestHandler(getConversationsController)
)

export default conversationRouter
