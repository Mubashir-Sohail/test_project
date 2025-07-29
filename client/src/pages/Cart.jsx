import { useEffect, useState } from "react";
import axiosApi from "../api/axiosApi.jsx";
import { useCart } from "../components/CartContext.jsx";
import { toast } from "react-toastify";

const Cart = () => {
  const { cartItems, setCartItems, addToCart } = useCart();
  const [loading, setloading] = useState(false);
  const [Data, setData] = useState([]);

  const fetchCartItems = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await axiosApi.get("/cart/fetch", { userId: user.id });
    const cartfetch = res.data.fetch;
    cartfetch.map((item) => addToCart(item));
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeFromCart = async (productId) => {
    try {
      await axiosApi.delete(`/cart/delete/${productId}`);

      setCartItems((prev) =>
        prev.filter((item) => item.product.id !== productId)
      );

      toast.success("Removed from cart", {
        style: {
          color: "red",
          fontWeight: "600",
          fontSize: "17px",
          background: "#F7F7F7",
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove from cart");
    }
  };

  const increaseValue = (id) => {
    setCartItems((prevData) =>
      prevData.map((item) => {
        const quantity = item.product.quantity - item.quantity;
        if (item.id === id && quantity >= 1) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      })
    );
  };

  const decreaseValue = (id) => {
    setCartItems((preData) =>
      preData.map((item) => {
        if (item.id === id && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
    );
  };

  useEffect(() => {
    console.log("CartItems>>>>>>", cartItems);
  }, [cartItems]);

  const checkOut = async (Data) => {
    cartItems.map((ele) => {
      const product = async () => {
        await axiosApi.patch(`/product/update`, ele.product);
        await axiosApi.delete(`/cart/delete/${ele.cart.id}`);
        const value = await axiosApi.post(`/order/checkout`, Data);
        window.location.href = value.data.url;
      };
      product();
    });
  };

  const handleClick = async () => {
    setloading(true);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <div className="title-col">Title</div>
        <div className="desc-col">Description</div>
        <div className="price-col">Price</div>
        <div className="quantity-col">Quantity</div>
        <div className="stock-col">Total Quantity</div>
      </div>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <h2>No items in cart</h2>
        ) : (
          cartItems.map((ele) => (
            <div className="cart-item" key={ele.cart.id}>
              <div className="title-col">{ele.product.title}</div>
              <div className="desc-col">{ele.product.description}</div>
              <div className="price-col">${ele.product.price}</div>
              <div className="quantity-col">
                <button onClick={() => decreaseValue(ele.id)}>-</button>
                {ele.quantity}
                <button onClick={() => increaseValue(ele.id)}>+</button>
              </div>
              <div className="stock-col">
                {ele.product.quantity - ele.quantity <= 0 ? (
                  <span style={{ color: "red" }}>Out of stock</span>
                ) : (
                  <span className="text-green-600 text-sm">In stock</span>
                )}
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(ele.product.id)}
              >
                x
              </button>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => {
          checkOut(Data);
          handleClick();
        }}
        className="checkout-btn"
        disabled={loading}
      >
        {loading ? <div className="spinner"></div> : "CheckOut"}
      </button>
    </div>
  );
};

export default Cart;
