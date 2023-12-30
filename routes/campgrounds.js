import express from 'express'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import { ExpressError } from '../utils/ExpressError.js'
import { Campground } from '../models/campground.js'
import { campgroundSchema } from '../schemas.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'

const router = express.Router()

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    req.flash('success', 'Successfully made a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, validateCampground, asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updates campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, asyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds')
}))

export default router