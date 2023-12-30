import express from 'express'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import { Campground } from '../models/campground.js'
import { Review } from '../models/review.js'
import { validateReview } from '../middlewares/validateReview.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'
import { isReviewAuthor } from '../middlewares/isReviewAuthor.js'

const router = express.Router({ mergeParams: true })

router.post('/', isLoggedIn, validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user.id
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Created new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`)
}))

export default router