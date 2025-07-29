import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Comment",
  tableName: "comment",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    content: {
      type: "varchar",
    },
    created_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
    },
    updated_at: {
      type: "timestamp",
      default: () => "CURRENT_TIMESTAMP",
      onUpdate: "CURRENT_TIMESTAMP",
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
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager: true,
    },
  },
});
