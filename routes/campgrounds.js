import express from 'express'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import { ExpressError } from '../utils/ExpressError.js'
import { Campground } from '../models/campground.js'
import { campgroundSchema } from '../schemas.js'

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

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews')
    console.log(campground)
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', asyncWrapper(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

export default router