import express from 'express'
import { isAuthentication } from '../middleware/isAuthentication.js'
import { addCartItem, deleteCartItem, fetchCartItem, updateCartItem } from '../controllers/cart.controller.js';


const router=express.Router()

router.route('/add/:id').post(isAuthentication,addCartItem)
router.route('/fetch').get(isAuthentication,fetchCartItem)
router.route('/edit/:id').patch(isAuthentication,updateCartItem)
router.route('/delete/:id').delete(isAuthentication,deleteCartItem)

export default router