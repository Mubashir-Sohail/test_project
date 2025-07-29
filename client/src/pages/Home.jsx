import { useEffect, useState } from "react";
import axiosApi from "../api/axiosApi.jsx";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup.jsx";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../components/CartContext.jsx";
import { toast } from "react-toastify";

const Home = () => {
  const [data, setData] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const navigate = useNavigate();
  const [viewComment, setViewComment] = useState(false);
  const [commentData, setcommentData] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const [activeProductId, setActiveProductId] = useState(null);
  const [userId, setUser] = useState();
  const { addToCart, user } = useCart();

  const fetchProducts = async () => {
    try {
      const res = await axiosApi.get("/product/fetch");
      const data = res.data;
      console.log("home", user);
      if (user) {
        const products = data.filter((ele) => ele.user.id !== user.id);

        console.log("Filtered products:", products);
        setData(products);
      } else {
        setData(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("products");
    console.log("I am here");
    fetchProducts();
    fetchCartItems();
  }, [user]);

  const Cart = async (productId, userId) => {
    console.log(productId, userId);
    const res = await axiosApi.post(`/cart/add/${productId}`);
    toast.success(res.data.message, {
      style: {
        color: "#f90b0bff",
        fontWeight: "600",
        fontSize: "17px",
        background: "#F7F7F7",
      },
    });
    return res.data.Cart;
  };

  const fetchCartItems = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const res = await axiosApi.get("/cart/fetch", { userId: user.id });
    console.log("fetch cart", res.data);
    const cartfetch = res.data.fetch;

    cartfetch.map((item) => {
      console.log("cartfetch", item);
      addToCart(item);
    });
  };

  const handleCommentChange = (e, productId) => {
    setCommentInputs({ ...commentInputs, [productId]: e.target.value });
  };

  const fetchComment = async (id) => {
    const res = await axiosApi.get(`/comment/get/${id}`);
    const sortedData = res.data.fetch;
    setcommentData(sortedData);
  };

  const submitComment = async (productId) => {
    try {
      const content = commentInputs[productId];
      if (!content) return alert("Please write a comment");

      const res = await axiosApi.post(`/comment/create/${productId}`, {
        content,
      });
      setCommentInputs({ ...commentInputs, [productId]: "" });
      fetchComment(productId);
    } catch (err) {
      console.log("Error:", err);
    }
  };
  const handleEdit = (commentId, oldContent) => {
    setEditingCommentId(commentId);
    setEditingContent(oldContent);
  };

  const handleUpdate = async () => {
    try {
      await axiosApi.patch(`/comment/update/${editingCommentId}`, {
        content: editingContent,
      });
      fetchComment(activeProductId);
      setEditingCommentId(null);
      setEditingContent("");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Update failed");
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axiosApi.delete(`/comment/delete/${commentId}`);
      toast.success("Delete Comment", {
        style: {
          color: "blue",
          fontWeight: "500",
          fontSize: "17px",
          background: "#F7F7F7",
        },
      });
      fetchComment(activeProductId);
    } catch (err) {
      console.error("Delete failed:", err);
      toast.success("Delete Failed", {
        style: {
          color: "red",
          fontWeight: "500",
          fontSize: "17px",
          background: "#F7F7F7",
        },
      });
    }
  };

  return (
    <div className="products-container">
      <div className="products-list">
        {data?.map((ele) => (
          <div key={ele.id} className="card_product">
            <div className="card">
              <div className="card-image-section">
                <img
                  src={ele.prodimage[0]?.image_url}
                  alt={ele.title}
                  className="main-product-img"
                />
                <FaShoppingCart
                  className="cart-icon"
                  onClick={async () => {
                    try {
                      const createdProduct = await Cart(ele.id, ele.user.id);
                      addToCart(createdProduct);
                    } catch (err) {
                      console.error("Failed to add to cart:", err);
                    }
                  }}
                />
              </div>
            </div>

            <div className="prod-title">{ele.title}</div>
            <div className="product-info">
              <div>
                <b>Description:</b> {ele.description}
              </div>
              <div>
                <b className="price">Price: $ {ele.price}</b>
              </div>
            </div>

            <div
              className="comment-toggle"
              onClick={() => {
                setActiveProductId(ele.id);
                fetchComment(ele.id);
                setViewComment(true);
              }}
            >
              Comments
            </div>

            <Popup
              visible={viewComment && activeProductId === ele.id}
              onClose={() => {
                setViewComment(false);
                setActiveProductId(null);
              }}
            >
              <div className="comment-scroll-area">
                {commentData.map((val) => (
                  <div key={val.id} className="comment-box">
                    <div>{val.content}</div>
                    {val.user.id === user?.id && (
                      <div className="comment-actions">
                        <button
                          onClick={() => handleEdit(val.id, val.content)}
                          className="commentbtn-edit"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(val.id)}
                          className="commentbtn-del"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {editingCommentId && (
                  <div className="edit-comment-section">
                    <input
                      type="text"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      placeholder="Edit your comment"
                      className="comment-input"
                    />
                    <button onClick={handleUpdate} className="commentbtn-edit">
                      Update
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="commentbtn-del"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <input
                type="text"
                placeholder="Write a comment"
                value={commentInputs[ele.id] || ""}
                onChange={(e) => handleCommentChange(e, ele.id)}
                className="comment-input"
              />
              <button
                onClick={() => submitComment(ele.id)}
                className="commentbtn"
              >
                Add Comment
              </button>
            </Popup>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
