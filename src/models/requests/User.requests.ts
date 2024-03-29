import { ParamsDictionary } from 'express-serve-static-core'
import { JwtPayload } from 'jsonwebtoken'
import { TokenType, UserVerifyStatus } from '~/constants/enums'

// Define schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     LoginBody:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           example: quangnguyenminh2001@gmail.com
 *         password:
 *           type: string
 *           example: Quang123456@!
 *
 *     SuccessAuthentication:
 *       type: object
 *       properties:
 *         access_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVkNWFhYzVlOWI1NTFkM2UxMGUyNGU5IiwidG9rZW5fdHlwZSI6MCwidmVyaWZ5IjoxLCJpYXQiOjE3MDg3NDczODAsImV4cCI6MTcwODgzMzc4MH0.4FZrK0XyFE8zOiHqkgJZ9Eafxwam6Nio_2IzgOqu0-w
 *         refresh_token:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVkNWFhYzVlOWI1NTFkM2UxMGUyNGU5IiwidG9rZW5fdHlwZSI6MSwidmVyaWZ5IjoxLCJpYXQiOjE3MDg3NDczODAsImV4cCI6MTcxNzM4NzM4MH0.lhPQZGmTdUkS3gPW8B2D3spqirJgiu5hV-W25uvg97I
 *
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           format: MongoId
 *           example: 65d5aac5e9b551d3e10e24e9
 *         name:
 *           type: string
 *           example: quang
 *         email:
 *           type: string
 *           format: email
 *           example: quangnguyenminh2001+2@gmail.com
 *         date_of_birth:
 *           type: string
 *           format: ISO8601
 *           example: 2024-02-13T11:56:01.000Z
 *         created_at:
 *           type: string
 *           format: ISO8601
 *           example: 2024-02-21T07:48:21.041Z
 *         updated_at:
 *           type: string
 *           format: ISO8601
 *           example: 2024-02-21T08:05:30.764Z
 *         verify:
 *           $ref: '#/components/schemas/UserVerifyStatus'
 *         twitter_circle:
 *           type: array
 *           format: MongoId
 *           example: ['65d5aac5e9b551d3e10e24e9', '67e5aac5e9b551d3e10e24e9']
 *         bio:
 *           type: string
 *           example: 'my name is john doe and i am a software engineer'
 *         location:
 *           type: string
 *           example: 'Los Angeles, CA, USA'
 *         website:
 *           type: string
 *           format: uri
 *           example: 'www.exc24k.com'
 *         username:
 *           type: string
 *           example: John Doe
 *         avatar:
 *           type: string
 *           example: 'https://localhost:4000/images/avatar/avatar.jpg'
 *         cover_photo:
 *           type: string
 *           example: 'localhost:4000/images/cover/cover.jpg'
 *
 *     UserVerifyStatus:
 *       type: number
 *       enum:
 *         - Unverified
 *         - Verified
 *         - Banned
 *       example: 1
 */

export interface UpdateMeReqBody {
  name?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface FollowReqBody {
  followed_user_id: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface VerifyEmailReqBody {
  email_verify_token: string
}

export interface GetProfileReqParams extends ParamsDictionary {
  username: string
}

export interface UnfollowReqParams extends ParamsDictionary {
  user_id: string
}

export interface RegisterReqBody {
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface RefreshTokenReqBody {
  refresh_token: string
}

export interface ForgotPasswordReqBody {
  email: string
}

export interface VerifyForgotPasswordReqBody {
  forgot_password_token: string
}

export interface ResetPasswordReqBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}

export interface ChangePasswordReqBody {
  old_password: string
  password: string
  confirm_password: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
  verify: UserVerifyStatus
  exp: number
  iat: number
}
