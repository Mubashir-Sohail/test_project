import { useState } from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosApi from "../api/axiosApi";
const UpdateProduct = () => {
  const [title, settitle] = useState("");
  const [description, setDescription] = useState("");
  const [serial_number, setSerial] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState([]);
  const data = useLocation();
  const navigate = useNavigate();


  const Data = data.state;
  useEffect(() => {}, []);
  const display = () => {
    const updateData = { id:Data.id,title, description, serial_number, price, quantity, image };
    console.log(updateData);
    createdProduct(updateData);
  };
  const createdProduct = async (Data) => {
    try {
      const formData = new FormData();
      formData.append("id",Data.id)
      formData.append("title", Data.title);
      formData.append("description", Data.description);
      formData.append("serial_number", Data.serial_number);
      formData.append("price", Data.price);
      formData.append("quantity", Data.quantity);
       
      Data.image.forEach((img) => {
        formData.append("image", img);
      });

      const res = await axiosApi.patch("/product/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product Created:", res.data);
      navigate('/')
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div
        style={{
          border: "5px ",
          borderRadius: "5px",
          width: "400px",
          height: "550px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#EFEFEF",

          paddingInline: "12px",
        }}
      >
        <h2
          style={{
            color: "red",
          }}
        >
          Update Product:
        </h2>
        <label>Title:</label>
        <input
          type="title"
          value={title}
          placeholder={Data.title}
          onChange={(e) => settitle(e.target.value)}
          style={{
            padding: "8px",
            marginBlock: "8px",
            border: "0.5px ",
          }}
        />
        <label>serial_number:</label>

        <input
          type="serial_number"
          value={serial_number}
          placeholder={Data.serial_number}
          onChange={(e) => setSerial(e.target.value)}
          style={{
            padding: "8px",
            marginBlock: "8px",
            border: "0.5px ",
          }}
        />
        <label>Description :</label>
        <input
          type="description"
          value={description}
          placeholder={Data.description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: "8px",
            marginBlock: "8px",
            border: "0.5px ",
          }}
        />
        <label>Price :</label>
        <input
          type="price"
          value={price}
          placeholder={Data.price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            padding: "8px",
            marginBlock: "8px",
            border: "0.5px ",
          }}
        />
        <label>Quantity :</label>
        <input
          type="quantity"
          value={quantity}
          placeholder={Data.quantity}
          onChange={(e) => setQuantity(e.target.value)}
          style={{
            padding: "8px",
            marginBlock: "8px",
            border: "0.5px ",
          }}
        />
        <label>Images :</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImage([...e.target.files])}
          style={{
            padding: "8px",
            marginBlock: "8px",
            border: "0.5px ",
          }}
        />

        <button
          onClick={display}
          style={{
            padding: "8px",
            border: "0.5px ",
            background: "red",
            color: "white",
            marginBlock: "8px",
          }}
        >
          Update
        </button>
      </div>
    </>
  );
};

export default UpdateProduct;
