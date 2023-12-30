import express from 'express'
import { User } from '../models/user.js'
import { asyncWrapper } from '../utils/asyncWrapper.js'
import passport from 'passport'

const router = express.Router()

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', asyncWrapper(async (req, res) => {
    try {
        const { email, password, username } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.flash('success', 'Welcome to Yelp Camp!')
        res.redirect('/campgrounds')
    }
    catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome back!')
    res.redirect('/campgrounds')
})

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err)
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
})

export default router