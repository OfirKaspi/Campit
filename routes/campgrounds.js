import express from 'express'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import { Campground } from '../models/campground.js'
import { isLoggedIn } from '../middlewares/isLoggedIn.js'
import { validateCampground } from '../middlewares/validateCampground.js'
import { isAuthor } from '../middlewares/isAuthor.js'

const router = express.Router()

router.get('/', asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', isLoggedIn, validateCampground, asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get('/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author')
    console.log(campground)
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    req.flash('success', 'Successfully updates campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, asyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds')
}))

export default router