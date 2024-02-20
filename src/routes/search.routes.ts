import { Router } from 'express'
import { searchController } from '~/controllers/searchs.controllers'

const searchRouter = Router()

searchRouter.get('/', searchController)

export default searchRouter
