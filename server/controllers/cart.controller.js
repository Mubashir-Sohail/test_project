import dataSource from "../db/db.js";
import Product from "../entities/products.js";
import User from "../entities/users.js";
import Cart from "../entities/cart.js";
import CartItem from "../entities/cartItem.js";

const productRepo = dataSource.getRepository("Product");
const userRepo = dataSource.getRepository("User");
const cartRepo = dataSource.getRepository("Cart");
const cartItemRepo = dataSource.getRepository("CartItem");

export const addCartItem = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.userId;

    console.log("productId", productId);
    console.log("userId", userId);

    const product = await productRepo.findOne({ where: { id: productId } });
    if (!product)
      return res.status(404).json({ message: "Product is not found!" });

    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ["cart"],
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (product.user.id == userId) {
      return res.status(400).json({
        message: "User cannot add-to-cart own their Product!",
      });
    }

    const quantity = 1;

    let cart = user.cart;
    if (!cart) {
      cart = await cartRepo.save(cartRepo.create({ user }));
      user.cart = cart;
      await userRepo.save(user);
    }

    let existingCartItem = await cartItemRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: product.id },
      },
      relations: ["product"],
    });

    if (!existingCartItem) {
      const cartItem = cartItemRepo.create({
        quantity,
        product,
        cart,
      });
      const savedCartItem = await cartItemRepo.save(cartItem);
      return res.status(201).json({
        success: true,
        message: "Product added to cart successfully!",
        Cart: savedCartItem,
      });
    }

    if (existingCartItem.quantity < existingCartItem.product.quantity) {
      existingCartItem.quantity += quantity;
      const updatedCartItem = await cartItemRepo.save(existingCartItem);
      return res.status(200).json({
        success: true,
        message: "Quantity updated in cart successfully!",
        Cart: updatedCartItem,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Product out of stock!",
        Cart: existingCartItem,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchCartItem = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const cart = await cartRepo.findOne({
      where: { user: { id: userId } },
    });
    console.log("cart", cart);

    const fetch = await cartItemRepo.find({
      relations: ["product", "cart"],
    });
    console.log("fetch", fetch);

    res.status(200).json({
      success: true,
      message: "fetch cart successfully",
      fetch,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.userId;
    const { quantity } = req.body;

    const cartItem = await cartRepo.findOne({
      where: { id: cartItemId },
      relations: ["user"],
    });

    if (!cartItem)
      return res.status(404).json({ message: "Cart item not found" });

    if (cartItem.user.id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this cart item" });
    }

    cartItem.quantity = quantity;
    await cartRepo.save(cartItem);

    res.status(200).json({ message: "Cart item updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const productId = req.params.id;  
    const userId = req.userId;         

    const cartItem = await cartItemRepo.findOne({
      where: {
        product: { id: productId },
        cart: { user: { id: userId } },
      },
      relations: ["product", "cart", "cart.user"],
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItemRepo.remove(cartItem);

    res.status(200).json({ message: "Cart item deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
