import { User } from '../models/user.js'
import { asyncWrapper } from '../utils/asyncWrapper.js'
export const renderRegister = (req, res) => {
    res.render('users/register')
}

export const register = asyncWrapper(async (req, res) => {
    try {
        const { email, password, username } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    }
    catch (err) {
        req.flash('error', err.message)
        res.redirect('/register')
    }
})

export const renderLogin = (req, res) => {
    res.render('users/login')
}

export const login = (req, res) => {
    req.flash('success', 'Welcome back!')
    const redirectUrl = res.locals.returnTo || '/campgrounds'
    res.redirect(redirectUrl)
}

export const logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) return next(err)
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
} 