import mongoose from 'mongoose'
import { Campground } from '../models/campground.js'
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
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            // YOUR USE ID
            author: '659063a36b6b6f80f6149e59',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(descriptors)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nobis, impedit officia culpa aliquam ducimus cum eum porro! Aliquam, praesentium? Voluptatem eaque fugit recusandae ipsa perspiciatis sit nesciunt, eligendi ea? Sit?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dudwjf2pu/image/upload/v1704032142/YelpCamp/mj76iareamn6rggmbejo.png',
                    filename: 'YelpCamp/mj76iareamn6rggmbejo'
                },
                {
                    url: 'https://res.cloudinary.com/dudwjf2pu/image/upload/v1704032144/YelpCamp/rqsxros86hl1xe4ifedk.png',
                    filename: 'YelpCamp/rqsxros86hl1xe4ifedk'
                }
            ],
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close()
})