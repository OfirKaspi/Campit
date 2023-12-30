import { Review } from '../models/review.js'

export const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have a permission to do that!')
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}