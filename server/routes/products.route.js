import express from 'express'
import { createProduct, deleteProduct, fetchProducts, fetchProductsByUserId,  updateProduct } from '../controllers/products.controller.js'
import { isAuthentication } from '../middleware/isAuthentication.js'
import upload from '../middleware/multer.js'


const router=express.Router()
router.route("/create").post(upload.array("image",3),isAuthentication, createProduct);
router.route("/update").patch(upload.array("image",3),isAuthentication, updateProduct);
router.route("/fetch").get(fetchProducts)
router.route("/fetch/:id", ).get(isAuthentication,fetchProductsByUserId);
router.route("/delete/:id").delete(isAuthentication,deleteProduct)
export default router