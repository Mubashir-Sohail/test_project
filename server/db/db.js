import "reflect-metadata";

import typeorm from "typeorm";
import User from "../entities/users.js";
import Product from "../entities/products.js";
import ProdImage from "../entities/productImages.js";
import Comment from "../entities/comment.js";
import Cart from "../entities/cart.js";
import CartItem from "../entities/cartItem.js";
import Order from "../entities/order.js";
import OrderItem from "../entities/orderItem.js";

const dataSource = new typeorm.DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres123",
  database: "test_projects",
  synchronize: true,
  logging: true,
  entities: [User,Product,ProdImage,Comment,Cart,CartItem,Order,OrderItem],
});

export default dataSource;
