import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "CartItem",
  tableName: "cartItem",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    quantity: {
      type: "int",
    },
  },
  relations: {
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: true,
      eager: true,
      onDelete: "CASCADE",
    },
    cart: {
      type: "many-to-one",
      target: "Cart",
      joinColumn: true,
      eager: true,
      onDelete: "CASCADE",
    },
  },
});
