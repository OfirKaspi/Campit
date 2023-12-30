import express from 'express'
import passport from 'passport'
import { checkReturnTo } from '../middlewares/checkReturnTo.js'
import { login, logout, register, renderLogin, renderRegister } from '../controllers/users.js'

const router = express.Router()

router.route('/register')
    .get(renderRegister)
    .post(register)

router.route('/login')
    .get(renderLogin)
    .post(checkReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), login)

router.get('/logout', logout)

export default router