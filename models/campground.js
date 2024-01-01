import mongoose from "mongoose";
import { Review } from "./review.js";
import { cloudinary } from "../cloudinary/index.js"

const Schema = mongoose.Schema

const ImageSchema = new Schema({
    url: String,
    filename: String

})

ImageSchema.virtual('cardImage').get(function () {
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop')
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete', async function (campground) {
    if (campground.reviews) {
        await Review.deleteMany({
            _id: { $in: campground.reviews }
        });
    }
    if (campground.images) {
        for (const img of campground.images) {
            await cloudinary.uploader.destroy(img.filename);
        }
    }
});

const Campground = mongoose.model('Campground', CampgroundSchema);

export { Campground }