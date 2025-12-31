const mongoose = require('mongoose');
const Review = require('./review');
const CampgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
})

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);