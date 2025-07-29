import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Order",
  tableName: "order",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    amount: {
      type: "varchar",
    },
    status: {
      type: "varchar",
    },
    payment_id: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
  },
});
