const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');
const isLoggedIn = require('../middleware').isLoggedIn;
const isAuthor = require('../middleware').isAuthor;
const reviews = require('../controllers/reviews.js');

const validateReview = require('../middleware.js').validateReview;

router.post('/', validateReview, isLoggedIn, reviews.createReviews);
router.delete('/:reviewId', isLoggedIn, reviews.deleteReviews);

module.exports = router;