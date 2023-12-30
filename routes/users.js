import express from 'express'
import { User } from '../models/user.js'
import { asyncWrapper } from '../utils/asyncWrapper.js'

const router = express.Router()

router.get('/register', (req, res, next) => {
    res.render('users/register')
})

router.post('/register', asyncWrapper(async (req, res, next) => {
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

export default router