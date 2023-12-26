import express from 'express'
import mongoose from 'mongoose'
import ejsMate from 'ejs-mate'
import methodOverride from 'method-override'
import path from 'path'
import { fileURLToPath } from 'url'

import { asyncWrapper } from './utils/asyncWrapper.js'
import { Campground } from './models/campground.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/campgrounds', asyncWrapper(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}))

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds', asyncWrapper(async (req, res, next) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', asyncWrapper(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', { campground })
}))

app.get('/campgrounds/:id/edit', asyncWrapper(async (req, res) => {
    const id = req.params.id
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.delete('/campgrounds/:id', asyncWrapper(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

app.use((err, req, res, next) => {
    res.send('OH BOY')
})

app.listen(3000, () => {
    console.log('Serving on port: 3000')
})