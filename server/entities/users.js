import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "User",
  tableName: "user",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
    },
    email: {
      type: "varchar",
      unique: true,
    },
    password: {
      type: "varchar",
    },
  },
  relations: {
    products: {
      type: "one-to-many",
      target: "Product",
      inverseSide: "user",
    },
    comments: {
      type: "one-to-many",
      target: "Comment",
      inverseSide: "user",
    },
    cart: {
      type: "one-to-one",
      target: "Cart",
      inverseSide: "user", 
    },
    orders: {
      type: "one-to-many",
      target: "Order",
      inverseSide: "user",
    },
  },
});
