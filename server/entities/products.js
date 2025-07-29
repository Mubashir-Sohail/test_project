import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Product",
  tableName: "product",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    serial_number: {
      type: "int",
      unique: true,
    },
    title: {
      type: "varchar",
    },
    description: {
      type: "varchar",
    },
    price: {
      type: "int",
    },
    quantity:{
      type:'int'
    }
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: true,
      eager:true,      
      onDelete: "CASCADE",

    },
    prodimage:{
      type: "one-to-many",
      target: "ProdImage",
      inverseSide:"image"
    },
    prodcomment:{
      type: "one-to-many",
      target: "Comment",
      inverseSide:"product"
      
    },
    prodCart:{
      type: "one-to-many",
      target: "Cart",
      inverseSide:"product"
      
    },
    prodOrder:{
      type: "one-to-many",
      target: "Order",
      inverseSide:"product"
      
    },
  },
});
