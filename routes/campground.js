const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');
const passport = require('passport');
const isLoggedIn = require('../middleware').isLoggedIn;
const isAuthor = require('../middleware').isAuthor;
const validateCampground = require('../middleware').validateCampground;
const campgrounds = require('../controllers/campgrounds');

router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, campgrounds.createCampground);
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.route('/:id')
    .put(isLoggedIn, isAuthor, validateCampground, campgrounds.editForm)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteForm)
    .get(campgrounds.showCampground);

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.renderEditForm);


module.exports = router;