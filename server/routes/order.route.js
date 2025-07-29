import express from "express";
import { createCheckoutSession, stripeWebhook } from "../controllers/order.controller.js";
import { isAuthentication } from "../middleware/isAuthentication.js";

const router = express.Router();

router.route("/checkout").post( isAuthentication, createCheckoutSession);

export default router;
