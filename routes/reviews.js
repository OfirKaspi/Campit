import express from 'express'
import { validateReview } from '../middlewares/validateReview.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'
import { isReviewAuthor } from '../middlewares/isReviewAuthor.js'
import { createReview, deleteReview } from '../controllers/reviews.js'

const router = express.Router({ mergeParams: true })

router.post('/', isLoggedIn, validateReview, createReview)
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, deleteReview)

export default router