import { Query } from 'express-serve-static-core'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enums'
import { Pagination } from './Tweet.requests'

export interface SearchQuery extends Pagination, Query {
  content: string
  media_type?: MediaTypeQuery
  people_follow?: PeopleFollow
}
