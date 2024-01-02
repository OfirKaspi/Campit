import { Campground } from '../models/campground.js'
import { cloudinary } from '../cloudinary/index.js'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js'

const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN
const geocoder = mbxGeocoding({ accessToken: MAPBOX_TOKEN })

export const index = asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

export const renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

export const createCampground = asyncWrapper(async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = (req.files.length)
        ? req.files.map(file => ({ url: file.path, filename: file.filename }))
        : [{ url: 'https://res.cloudinary.com/dudwjf2pu/image/upload/v1704032975/YelpCamp/zpfniigy0vbig886nu2w.png', filename: 'image' }]

    campground.author = req.user._id
    await campground.save()
    req.flash('success', 'Successfully made a new Campground')
    res.redirect(`/campgrounds/${campground._id}`)
})

export const showCampground = asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
        .populate({ path: 'reviews', populate: { path: 'author' } })
        .populate('author')
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', { campground })
})

export const renderEditForm = asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
})

export const updateCampground = asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    const newImages = req.files.map(file => ({ url: file.path, filename: file.filename }))
    campground.images.push(...newImages)
    await campground.save()
    console.log(campground);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', 'Successfully updates campground')
    res.redirect(`/campgrounds/${campground._id}`)
})

export const deleteCampground = asyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted Campground')
    res.redirect('/campgrounds')
})