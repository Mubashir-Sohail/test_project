import { useEffect, useState } from "react";
import axiosApi from "../api/axiosApi.jsx";
import { useNavigate } from "react-router-dom";

const MyProduct = () => {
  const [Data, setData] = useState([]);
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axiosApi.get(`/product/fetch/${user.id}`);
      setData(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [product]);

  const deleteProd = async (id) => {
    await axiosApi.delete(`/product/delete/${id}`);
    fetchProducts();
  };

  const updateProd = (ele) => {
    navigate("/updateProd", { state: ele });
  };

  return (
    <div className="myproduct-container">
      <div className="myproduct-header">
        <h1>My Products :</h1>
      </div>

      <div className="product-grid">
        {Data.map((ele) => (
          <div key={ele.id} className="card_product">
            <div className="card">
              <div className="main-image-section">
                <img
                  src={ele.prodimage[0]?.image_url}
                  alt={ele.title}
                  className="main-image"
                />
                <button
                  className="delete-btn"
                  onClick={() => deleteProd(ele.id)}
                >
                  x
                </button>
              </div>

              {ele.prodimage.length > 1 && (
                <div className="thumbnail-section">
                  {ele.prodimage.slice(1).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.image_url}
                      alt={`thumb-${idx}`}
                      className="thumbnail-img"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="product-title">{ele.title}</div>

            <div className="product-details">
              <div>
                <b>Description:</b> {ele.description}
              </div>
              <div>
                <b className="product-price">Price: $ {ele.price}</b>
              </div>
            </div>

            <button className="update-btn" onClick={() => updateProd(ele)}>
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProduct;
