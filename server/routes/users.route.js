import express from 'express'
import { refreshToken, SignIn, SignUp } from '../controllers/users.controller.js'


const router=express.Router()

router.route('/signup').post(SignUp)
router.route('/signin').post(SignIn)
router.route('/refresh').post(refreshToken);


export default router