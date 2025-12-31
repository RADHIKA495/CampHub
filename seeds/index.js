const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptor } = require('./seedHelpers')
mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(`errror : ${err}`);
    })

const sample = (array) => {
    return array[Math.floor(Math.random() * (array.length))];

}

const seedDB = async () => {
    console.log("Seeding started...");
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000) - 1;
        const pricey = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '695267b9942e017ed151414d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptor)} ${sample(places)}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            description: "blah blah blah balahhahah",
            price: pricey
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});