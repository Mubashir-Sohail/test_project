import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "ProdImage",
  table: "prodImg",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    image_url: {
      type: "varchar",
    },
  },
  relations: {
    image: {
      type: "many-to-one",
      target: "Product",
      joinColumn: true,
      eager: true,
      onDelete: "CASCADE",
    },
  },
});
