import express from 'express'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import { ExpressError } from '../utils/ExpressError.js'
import { Campground } from '../models/campground.js'
import { Review } from '../models/review.js'
import { reviewSchema } from '../schemas.js'

const router = express.Router({ mergeParams: true })

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.post('/', validateReview, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    console.log(review);
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId', asyncWrapper(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

export default router