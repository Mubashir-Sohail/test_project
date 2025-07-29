import { useEffect, useState } from "react";
import axiosApi from "../api/axiosApi";
import { useNavigate } from "react-router-dom";

const CreateProd = () => {
  const [title, settitle] = useState("");
  const [description, setDescription] = useState("");
  const [serial_number, setSerial] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [image, setImage] = useState([]);
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const display = () => {
    const Data = { title, description, serial_number, price, quantity, image };
    console.log(Data);
    createdProduct(Data);
  };

  const createdProduct = async (Data) => {
    try {
      const formData = new FormData();
      formData.append("title", Data.title);
      formData.append("description", Data.description);
      formData.append("serial_number", Data.serial_number);
      formData.append("price", Data.price);
      formData.append("quantity", Data.quantity);

      Data.image.forEach((img) => {
        formData.append("image", img);
      });

      const res = await axiosApi.post("/product/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Product Created:", res.data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handlerClick = async () => {
    setloading(true);
    navigate("/");
  };

  return (
    <div className="create-container">
      <h2>Create New Product</h2>

      <div className="row-space-between">
        <label>Title:</label>
        <input
          type="text"
          value={title}
          placeholder="title"
          onChange={(e) => settitle(e.target.value)}
          className="input-field"
        />
        <label>Serial Number:</label>
        <input
          type="text"
          value={serial_number}
          placeholder="serial_number"
          onChange={(e) => setSerial(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="description-row">
        <label>Description:</label>
        <input
          type="text"
          value={description}
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
          className="description-input"
        />
      </div>

      <div className="row-space-between">
        <label>Price :</label>
        <input
          type="number"
          value={price}
          placeholder="$"
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />
        <label>Quantity :</label>
        <input
          type="number"
          value={quantity}
          placeholder="quantity"
          onChange={(e) => setQuantity(e.target.value)}
          className="input-field"
        />
      </div>

      <div className="image-row">
        <label>Images :</label>
        <input
          type="file"
          multiple
          onChange={(e) => setImage([...e.target.files])}
          className="image-input"
        />
      </div>

      <button
        onClick={() => {
          display();
          handlerClick();
        }}
        className="create-button"
        disabled={loading}
      >
        {loading ? <div className="spinner"></div> : "Create Product"}
      </button>
    </div>
  );
};

export default CreateProd;
