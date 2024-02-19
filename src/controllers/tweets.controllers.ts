import { ParamsDictionary } from 'express-serve-static-core'
import { NextFunction, Request, Response } from 'express'
import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import tweetsService from '~/services/tweets.services'
import { TokenPayload } from '~/models/requests/User.requests'

export const createTweetController = async (req: Request<ParamsDictionary, any, TweetRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweet(user_id, req.body)
  return res.json({
    message: 'Create tweet successfully',
    result
  })
}

export const getTweetDetailController = async (req: Request, res: Response) => {
  // const { tweet_id } = req.params
  // const result = await tweetsService.getTweetDetail(tweet_id)
  return res.json({
    message: 'Get tweet detail successfully',
    result: 'ok'
  })
}
