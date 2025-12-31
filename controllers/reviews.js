const Review = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

module.exports.createReviews = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.review.push(review);
    review.author = req.user._id;
    await review.save();
    await campground.save();
    req.flash('success', 'Succesfully made a new review!');
    res.redirect(`/campgrounds/${campground._id}`);
})

module.exports.deleteReviews = catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "you donot have permission to to do that");
        return res.redirect(`/campgrounds/${id}`);
    }
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Succesfully deleted the review!');
    res.redirect(`/campgrounds/${id}`);
})