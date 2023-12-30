import express from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'
import { validateCampground } from '../middlewares/validateCampground.js'
import { isAuthor } from '../middlewares/isAuthor.js'
import { index, createCampground, renderNewForm, showCampground, renderEditForm, updateCampground, deleteCampground } from '../controllers/campgrounds.js'

const router = express.Router()

router.get('/', index)
router.get('/new', isLoggedIn, renderNewForm)
router.post('/', isLoggedIn, validateCampground, createCampground)
router.get('/:id', showCampground)
router.get('/:id/edit', isLoggedIn, isAuthor, renderEditForm)
router.put('/:id', isLoggedIn, isAuthor, validateCampground, updateCampground)
router.delete('/:id', isLoggedIn, isAuthor, deleteCampground)

export default router