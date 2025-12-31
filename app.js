const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const flash = require('connect-flash');
const Joi = require('joi');
const path = require('path');
const ExpressError = require('./utils/ExpressError');

const methodOverride = require('method-override');
const { campgroundSchema, reviewSchema } = require('./schemas');
const campgroundRoutes = require('./routes/campground');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');
const session = require("express-session");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const app = express();
app.use(flash());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);


const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const Campground = require('./models/campground');
const Review = require('./models/review');

mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp")
    .then(() => {
        console.log("Database connected");
    })
    .catch((err) => {
        console.log(`errror : ${err}`);
    })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success') || [];
    res.locals.error = req.flash('error') || [];
    next();

})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);
app.use('/', userRoutes);


app.use((req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "SOMETHING WENT WRONG!!";
    res.status(statusCode).render('errors', { err });
})
app.get('/', (req, res) => {
    res.render("home");
})

app.listen(12000, () => {
    console.log("Serving on port 12000!");
})