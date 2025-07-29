import dotenv from "dotenv";
dotenv.config();
import express from "express";

import cors from "cors";

import dataSource from "./db/db.js";
import userRoute from "./routes/users.route.js";
import productRoute from "./routes/products.route.js";
import commentRoute from "./routes/comment.route.js";
import CartRoute from "./routes/Cart.route.js";
import orderRouter from "./routes/order.route.js";
import bodyParser from "body-parser";
import { stripeWebhook } from "./controllers/order.controller.js";

const app = express();
app.use(
  "/api/v1/order/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);
dotenv.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
const Port = process.env.PORT;

app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/comment", commentRoute);
app.use("/api/v1/cart", CartRoute);
app.use("/api/v1/order", orderRouter);

dataSource
  .initialize()
  .then(() => {
    console.log("Database connected successfully");

    app.listen(Port, () => {
      console.log(`Server is running on http://localhost:${Port}`);
    });
  })

  .catch((err) => {
    console.error("Database connection failed:", err);
  });
