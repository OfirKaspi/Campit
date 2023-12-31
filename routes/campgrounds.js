import express from 'express'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'
import { validateCampground } from '../middlewares/validateCampground.js'
import { isAuthor } from '../middlewares/isAuthor.js'
import { index, createCampground, renderNewForm, showCampground, renderEditForm, updateCampground, deleteCampground } from '../controllers/campgrounds.js'
import { storage } from '../cloudinary/index.js'
import multer from 'multer'

const upload = multer({ storage })
const router = express.Router()

router.route('/')
    .get(index)
    .post(isLoggedIn, upload.array('image'), validateCampground, createCampground)

router.get('/new', isLoggedIn, renderNewForm)

router.route('/:id')
    .get(showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, updateCampground)
    .delete(isLoggedIn, isAuthor, deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, renderEditForm)

export default router