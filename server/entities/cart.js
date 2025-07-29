import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Cart",
  tableName: "cart",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
      inverseSide: "cart", 
    },
    cartItems: {
      type: "one-to-many",
      target: "CartItem",
      inverseSide: "cart",
    },
    
  },
});
