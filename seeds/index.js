import mongoose from 'mongoose'
import Campground from '../models/campground.js'
import { cities } from './cities.js'
import { descriptors, places } from './seedHelpers.js'

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('Database connected')
})

const sample = arr => arr[Math.floor(Math.random() * arr.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(descriptors)}`,
            image: 'http://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, impedit officia culpa aliquam ducimus cum eum porro! Aliquam, praesentium? Voluptatem eaque fugit recusandae ipsa perspiciatis sit nesciunt, eligendi ea? Sit?',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})