import express from 'express'
import mongoose from 'mongoose'
import ejsMate from 'ejs-mate'
import methodOverride from 'method-override'
import path from 'path'
import { fileURLToPath } from 'url'

import { asyncWrapper } from './utils/asyncWrapper.js'
import { ExpressError } from './utils/ExpressError.js'
import { Campground } from './models/campground.js'
import { Review } from './models/review.js'
import { campgroundSchema, reviewSchema } from './schemas.js'

import campgrounds from './routes/campgrounds.js'
import reviews from './routes/reviews.js'

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
app.use(express.static(path.join(__dirname, 'public')))

app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port: 3000')
})