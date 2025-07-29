import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "OrderItem",
  tableName: "orderItem",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    quantity:{
        type:'int'
    },
    price: {
      type: "varchar",
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
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
    order: {
      type: "many-to-one",
      target: "Order",
      joinColumn: true,
      eager: true,
      onDelete: "CASCADE",
    },
  },
});
