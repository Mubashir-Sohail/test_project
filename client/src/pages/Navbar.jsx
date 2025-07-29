import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../components/CartContext.jsx";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, cartItems, logout } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logout successfully!", {
      style: {
        color: "red",
        fontWeight: "600",
        fontSize: "17px",
        background: "#F7F7F7",
      },
    });
    navigate("/");
  };

  useEffect(() => {
    if (user === null) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="navbar">
      <h2 className="">
        <Link className="navbar-heading" to="/">
          Exclusive{" "}
        </Link>
      </h2>

      <div>
        {user ? (
          <>
            <Link className="link-style" to="/">
              Home
            </Link>
            <Link className="link-style" to="/createdProd">
              New Product
            </Link>
            <Link className="link-style" to="/myproduct">
              My Product
            </Link>
            <Link className="link-style" to="/cart">
              <FaShoppingCart className="cart-icon" />
              {cartItems.length}
            </Link>
            <Link onClick={handleLogout} className="link-style">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link className="auth-button" to="/SignUp">
              SignUp
            </Link>
            <Link className="auth-button" to="/SignIn">
              SignIn
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
