import { Request, Response } from 'express'
import conversationService from '~/services/conversations.services'

export const getConversationsController = async (req: Request, res: Response) => {
  const { receiver_id } = req.params
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const sender_id = req.decoded_authorization?.user_id as string

  const result = await conversationService.getConversations({
    sender_id,
    receiver_id,
    limit,
    page
  })

  return res.json({
    result: {
      limit,
      page,
      total_page: Math.ceil(result.total / limit),
      conversations: result.conversations
    },

    message: 'Get all conversations successfully'
  })
}
