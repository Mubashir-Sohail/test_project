import { createContext, useContext, useState } from "react";

const CartContext = createContext();
const userJson = localStorage.getItem("user") 
const initialStates = {
  accesToken: localStorage.getItem("accesToken")  ?? null,
  refreshToken: localStorage.getItem("refreshToken")  ?? null,
  user: userJson ? JSON.parse(userJson) : null
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [auth, setAuth] = useState(initialStates);

  const setUser = ({accesToken, refreshToken, user}) => {
    setAuth({
      accesToken,
      refreshToken,
      user
    })
    localStorage.setItem("accesToken",accesToken)
    localStorage.setItem("refreshToken",refreshToken)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const logout = () => {
    localStorage.clear()
    setAuth({
    accesToken: null,
    refreshToken: null,
    user: null
  });
  }

  const addToCart = (product) => {
    setCartItems((prevCartItems) => {
      const existingItem = prevCartItems.find(
        (item) => item.product.id === product.product.id
      );

      if (!existingItem) {
        return [...prevCartItems, product];
      }

      if (existingItem.quantity < existingItem.product.quantity) {
        return prevCartItems.map((item) =>
          item.product.id === product.product.id
            ? { ...item, quantity: product.quantity }
            : item
        );
      } else {
        console.log("Product quantity limit reached", existingItem);
        return prevCartItems;
      }
    });
  };
 

  return (
    <CartContext.Provider
      value={{
        ...auth,
        cartItems,
        addToCart,
        setCartItems,
        setUser,
        logout
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
