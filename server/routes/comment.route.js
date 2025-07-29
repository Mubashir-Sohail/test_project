import express from 'express'
import { isAuthentication } from '../middleware/isAuthentication.js'
import { createComment, delComment, editComment, fetchComment } from '../controllers/comment.controller.js'

const router=express.Router()
router.route("/create/:id").post(isAuthentication,createComment)
router.route("/get/:id").get(isAuthentication,fetchComment)

router.route("/update/:id").patch(isAuthentication,editComment)
router.route("/delete/:id").delete(isAuthentication,delComment)
export default router